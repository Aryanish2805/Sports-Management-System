import { useEffect, useState } from 'react';
import API from '../services/api';

const Leaderboard = () => {
  const [standings, setStandings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const { data } = await API.get('/tournaments');
        setTournaments(data);
        if (data.length > 0) setSelectedTournament(data[0]._id);
      } catch (e) { setLoading(false); }
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/standings?tournament=${selectedTournament}`);
        setStandings(data);
      } catch (e) { } finally { setLoading(false); }
    };
    fetchStandings();
  }, [selectedTournament]);

  const currentTournament = tournaments.find(t => t._id === selectedTournament);
  const sportEmoji = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐', Other: '🏅' };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      <div className="page-header">
        <div className="container">
          <div className="section-tag mb-2">Leaderboard</div>
          <h1 style={{ color: 'var(--text-dark)' }}>Live Standings</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 20px' }}>Real-time tournament rankings</p>
          <div className="d-flex gap-2 flex-wrap">
            {tournaments.map(t => (
              <button key={t._id} onClick={() => setSelectedTournament(t._id)}
                style={{ padding: '8px 20px', borderRadius: 50, border: selectedTournament === t._id ? '1.5px solid var(--accent)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', background: selectedTournament === t._id ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.04)', color: selectedTournament === t._id ? 'var(--accent)' : 'var(--text-muted)' }}>
                {sportEmoji[t.sport_type] || '🏅'} {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {currentTournament && (
          <div className="d-flex align-items-center gap-3 mb-4">
            <span style={{ fontSize: '2rem' }}>{sportEmoji[currentTournament.sport_type] || '🏅'}</span>
            <div>
              <h5 style={{ fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{currentTournament.name}</h5>
              <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>{currentTournament.sport_type} · {currentTournament.format?.replace('_',' ')}</span>
            </div>
          </div>
        )}

        {loading && <div className="loading-overlay"><div className="spinner-custom"></div></div>}
        {!loading && standings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h5>No standings yet</h5>
            <p>Standings are updated automatically when match scores are entered.</p>
          </div>
        )}

        {!loading && standings.length > 0 && (
          <>
            {/* Top 3 podium */}
            {standings.length >= 3 && (
              <div className="row g-3 mb-4">
                {[standings[1], standings[0], standings[2]].map((s, idx) => {
                  const pos = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                  const heights = { 1: 140, 2: 110, 3: 90 };
                  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
                  const gradients = {
                    1: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    2: 'linear-gradient(135deg, #0a0a0f, #18181f)',
                    3: 'linear-gradient(135deg, #111118, #1e1e28)',
                  };
                  const textColors = {
                    1: '#38bdf8',
                    2: '#94a3b8',
                    3: '#cbd5e1',
                  };
                  if (!s) return <div key={idx} className="col-4" />;
                  return (
                    <div key={idx} className="col-4 d-flex flex-column align-items-center justify-content-end" style={{ minHeight: 180 }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{medals[pos]}</div>
                      <div className="team-avatar mb-2" style={{ background: s.team?.logo_color || 'var(--grad-primary)', width: 48, height: 48, fontSize: '1.1rem', borderRadius: 12 }}>{s.team?.name?.charAt(0)}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', marginBottom: 6, color: 'var(--text-dark)' }}>{s.team?.name}</div>
                      <div style={{ background: gradients[pos], borderRadius: '12px 12px 0 0', width: '100%', height: heights[pos], display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid var(--border)', borderBottom: 'none' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.6rem', color: textColors[pos] }}>{s.points}</div>
                        <div style={{ color: pos === 1 ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>pts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div className="stms-table">
              <table className="table table-borderless mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 50, color: 'var(--primary-dark)' }}>#</th>
                    <th style={{ color: 'var(--primary-dark)' }}>Team</th>
                    <th style={{ color: 'var(--primary-dark)' }}>P</th><th style={{ color: 'var(--primary-dark)' }}>W</th><th style={{ color: 'var(--primary-dark)' }}>L</th><th style={{ color: 'var(--primary-dark)' }}>D</th>
                    <th style={{ color: 'var(--primary-dark)' }}>GF</th><th style={{ color: 'var(--primary-dark)' }}>GA</th><th style={{ color: 'var(--primary-dark)' }}>GD</th>
                    <th style={{ color: 'var(--primary-dark)' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr key={s._id} style={{ background: i === 0 ? 'rgba(56,189,248,0.07)' : '' }}>
                      <td>
                        <div className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`}>{i + 1}</div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="team-avatar" style={{ background: s.team?.logo_color || 'var(--grad-primary)', width: 34, height: 34, fontSize: '0.85rem', borderRadius: 9 }}>{s.team?.name?.charAt(0)}</div>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{s.team?.name}</span>
                          {i === 0 && <span style={{ fontSize: '0.7rem', background: 'var(--grad-primary)', color: '#fff', padding: '2px 8px', borderRadius: 50, fontWeight: 700 }}>LEADER</span>}
                        </div>
                      </td>
                      <td>{s.played}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{s.wins}</td>
                      <td style={{ color: 'var(--danger)' }}>{s.losses}</td>
                      <td>{s.draws}</td>
                      <td>{s.goals_for}</td>
                      <td>{s.goals_against}</td>
                      <td style={{ color: s.goals_for - s.goals_against >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                        {s.goals_for - s.goals_against > 0 ? '+' : ''}{s.goals_for - s.goals_against}
                      </td>
                      <td>
                        <span style={{ fontWeight: 900, fontSize: '1rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                          {s.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex gap-4 mt-3 flex-wrap" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>P = Played</span><span>W = Won</span><span>L = Lost</span><span>D = Draw</span><span>GF = Goals For</span><span>GA = Goals Against</span><span>GD = Goal Diff</span><span>Pts = Points</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
