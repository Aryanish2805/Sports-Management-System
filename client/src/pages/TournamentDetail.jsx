import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const sportEmoji = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐', Other: '🏅' };
const statusColor = { upcoming: '#be185d', ongoing: '#9d174d', completed: '#831843', scheduled: '#be185d' };
const statusBg = { upcoming: 'rgba(244,114,182,0.15)', ongoing: 'rgba(236,72,153,0.15)', completed: 'rgba(157,23,77,0.15)' };

const TournamentDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editStatus, setEditStatus] = useState('');

  const fetchAll = async () => {
    try {
      const [tRes, teRes, mRes, sRes] = await Promise.all([
        API.get(`/tournaments/${id}`),
        API.get(`/teams?tournament=${id}`),
        API.get(`/matches?tournament=${id}`),
        API.get(`/standings?tournament=${id}`),
      ]);
      setTournament(tRes.data);
      setEditStatus(tRes.data.status);
      setTeams(teRes.data);
      setMatches(mRes.data);
      setStandings(sRes.data);
    } catch (e) { } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await API.put(`/tournaments/${id}`, { status: editStatus });
      fetchAll();
    } catch (e) { }
  };

  if (loading) return <div className="loading-overlay"><div className="spinner-custom"></div></div>;
  if (!tournament) return <div className="container py-5 text-center"><h4>Tournament not found</h4><Link to="/tournaments" style={{color: 'var(--primary-dark)'}}>← Back</Link></div>;

  const tabs = ['overview', 'teams', 'matches', 'standings'];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <Link to="/tournaments" style={{ color: 'var(--primary-dark)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>← Back to Tournaments</Link>
          <div className="d-flex align-items-start justify-content-between mt-3 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(244,114,182,0.3))' }}>{sportEmoji[tournament.sport_type] || '🏅'}</span>
              <div>
                <h1 style={{ color: 'var(--text-dark)', marginBottom: 4 }}>{tournament.name}</h1>
                <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                  <span className="status-badge" style={{ background: statusBg[tournament.status], color: statusColor[tournament.status], textTransform: 'capitalize' }}>{tournament.status}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>📅 {new Date(tournament.start_date).toLocaleDateString()} – {new Date(tournament.end_date).toLocaleDateString()}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>🔢 {tournament.format?.replace('_',' ')}</span>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="d-flex align-items-center gap-2">
                <select className="form-select form-select-sm" style={{ background: '#fff', color: 'var(--text-dark)', border: '1.5px solid var(--border)', width: 'auto', borderRadius: 8, padding: '8px 30px 8px 12px' }}
                  value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="btn-primary-custom" style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: 8 }} onClick={handleStatusUpdate}>Update Status</button>
              </div>
            )}
          </div>
          {/* Tabs */}
          <div className="d-flex gap-2 mt-4 overflow-auto pb-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '8px 24px', borderRadius: 50, border: activeTab === tab ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s', background: activeTab === tab ? 'var(--pink-100)' : 'var(--pink-50)', color: activeTab === tab ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            {[
              { label: 'Teams Registered', value: teams.length, icon: '👥' },
              { label: 'Total Matches', value: matches.length, icon: '📅' },
              { label: 'Completed', value: matches.filter(m => m.status === 'completed').length, icon: '✅' },
              { label: 'Max Teams', value: tournament.max_teams, icon: '🔢' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="stms-card text-center" style={{ padding: '30px 20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 12, filter: 'drop-shadow(0 4px 6px rgba(244,114,182,0.2))' }}>{s.icon}</div>
                  <h3 style={{ fontWeight: 800, fontSize: '2.2rem', margin: '0 0 4px', color: 'var(--text-dark)' }}>{s.value}</h3>
                  <p style={{ color: 'var(--primary-dark)', margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>{s.label}</p>
                </div>
              </div>
            ))}
            <div className="col-12">
              <div className="stms-card mt-2">
                <h5 style={{ fontWeight: 800, marginBottom: 16, color: 'var(--text-dark)' }}>About this tournament</h5>
                <p style={{ color: 'var(--text-body)', margin: 0, lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {tournament.description || `${tournament.name} is a ${tournament.sport_type} tournament organized by ${tournament.organizer?.name || 'Admin'}. Format: ${tournament.format?.replace('_', ' ')}.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Teams */}
        {activeTab === 'teams' && (
          <>
            {teams.length === 0 ? <div className="empty-state"><div className="empty-icon">👥</div><h5>No teams registered</h5><p>Teams will appear here once they register.</p></div> : (
              <div className="row g-4">
                {teams.map(t => (
                  <div key={t._id} className="col-md-6 col-lg-4">
                    <div className="stms-card">
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="team-avatar" style={{ background: t.logo_color || 'var(--grad-primary)', width: 56, height: 56, fontSize: '1.2rem' }}>{t.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{t.name}</div>
                          <div style={{ color: 'var(--primary-dark)', fontSize: '0.82rem', fontWeight: 600 }}>Manager: {t.manager?.name}</div>
                        </div>
                      </div>
                      {t.contact_info && <div style={{ color: 'var(--text-body)', fontSize: '0.82rem', marginBottom: 16 }}>📞 {t.contact_info}</div>}
                      {t.members?.length > 0 && (
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>PLAYERS ({t.members.length})</div>
                          <div className="d-flex flex-wrap gap-2">
                            {t.members.map((m, i) => (
                              <span key={i} style={{ background: 'var(--pink-100)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 500, border: '1px solid var(--border)' }}>{m}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Matches */}
        {activeTab === 'matches' && (
          <>
            {matches.length === 0 ? <div className="empty-state"><div className="empty-icon">📅</div><h5>No matches scheduled</h5></div> : (
              <div className="d-flex flex-column gap-3">
                {matches.map(m => (
                  <div key={m._id} className="match-card">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div className="team-name-match" style={{ color: 'var(--text-dark)' }}>{m.team1?.name}</div>
                      </div>
                      <div className="text-center" style={{ minWidth: 120 }}>
                        {m.status === 'completed' ? (
                          <div className="match-score" style={{ color: 'var(--primary-dark)' }}>{m.score1} – {m.score2}</div>
                        ) : (
                          <div className="match-vs" style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 800 }}>VS</div>
                        )}
                        <div style={{ color: 'var(--text-body)', fontSize: '0.75rem', marginTop: 8, fontWeight: 500 }}>{new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'})}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="team-name-match" style={{ color: 'var(--text-dark)' }}>{m.team2?.name}</div>
                      </div>
                      <span style={{ background: statusBg[m.status] || 'rgba(236,72,153,0.15)', color: statusColor[m.status] || '#9d174d', padding: '6px 14px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', border: '1.5px solid var(--border)' }}>{m.status}</span>
                    </div>
                    {m.winner && <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--primary-dark)', fontSize: '0.85rem', fontWeight: 700, background: 'var(--pink-100)', display: 'inline-block', position: 'relative', left: '50%', transform: 'translateX(-50%)', padding: '6px 16px', borderRadius: 50, border: '1px solid var(--border)' }}>🏆 Winner: {m.winner?.name}</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Standings */}
        {activeTab === 'standings' && (
          <>
            {standings.length === 0 ? <div className="empty-state"><div className="empty-icon">📊</div><h5>No standings yet</h5><p>Standings update automatically when match scores are entered.</p></div> : (
              <div className="stms-table">
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th style={{ color: 'var(--primary-dark)' }}>#</th>
                      <th style={{ color: 'var(--primary-dark)' }}>Team</th>
                      <th style={{ color: 'var(--primary-dark)' }}>P</th><th style={{ color: 'var(--primary-dark)' }}>W</th><th style={{ color: 'var(--primary-dark)' }}>L</th><th style={{ color: 'var(--primary-dark)' }}>D</th>
                      <th style={{ color: 'var(--primary-dark)' }}>GF</th><th style={{ color: 'var(--primary-dark)' }}>GA</th>
                      <th style={{ color: 'var(--primary-dark)' }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s, i) => (
                      <tr key={s._id} style={{ background: i === 0 ? 'var(--pink-100)' : '' }}>
                        <td><div className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`}>{i + 1}</div></td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="team-avatar" style={{ background: s.team?.logo_color || 'var(--grad-primary)', width: 34, height: 34, fontSize: '0.85rem', borderRadius: 8 }}>{s.team?.name?.charAt(0)}</div>
                            <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{s.team?.name}</span>
                            {i === 0 && <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: 50, fontWeight: 700 }}>LEADER</span>}
                          </div>
                        </td>
                        <td>{s.played}</td>
                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>{s.wins}</td>
                        <td style={{ color: 'var(--danger)' }}>{s.losses}</td>
                        <td>{s.draws}</td>
                        <td>{s.goals_for}</td>
                        <td>{s.goals_against}</td>
                        <td><span style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>{s.points}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TournamentDetail;
