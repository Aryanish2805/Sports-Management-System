import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const statusColor = { 
  scheduled: { bg: 'var(--pink-100)', text: 'var(--primary-dark)' }, 
  ongoing: { bg: 'rgba(236,72,153,0.15)', text: '#9d174d' }, 
  completed: { bg: 'rgba(157,23,77,0.15)', text: '#831843' } 
};

const Matches = () => {
  const { isAdmin } = useAuth();
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filterTournament, setFilterTournament] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({ tournament: '', team1: '', team2: '', date: '', venue: '', round: 'Group Stage' });
  const [score, setScore] = useState({ score1: 0, score2: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const filt = filterTournament !== 'all' ? `?tournament=${filterTournament}` : '';
      const [mRes, tRes, teRes] = await Promise.all([API.get(`/matches${filt}`), API.get('/tournaments'), API.get('/teams')]);
      setMatches(mRes.data);
      setTournaments(tRes.data);
      setTeams(teRes.data);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filterTournament]);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await API.post('/matches', form);
      setShowCreateModal(false);
      setForm({ tournament: '', team1: '', team2: '', date: '', venue: '', round: 'Group Stage' });
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || 'Failed to schedule match'); }
    finally { setSubmitting(false); }
  };

  const handleScoreUpdate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await API.put(`/matches/${selectedMatch._id}/score`, { ...score, status: 'completed' });
      setShowScoreModal(false);
      fetchAll();
    } catch (err) { } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return;
    try { await API.delete(`/matches/${id}`); fetchAll(); } catch (e) { }
  };

  const filteredMatches = filterStatus === 'all' ? matches : matches.filter(m => m.status === filterStatus);
  const teamsForTournament = form.tournament ? teams.filter(t => t.tournament?._id === form.tournament || t.tournament === form.tournament) : [];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="section-tag mb-2">Matches</div>
              <h1 style={{ color: 'var(--text-dark)' }}>Match Schedule</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{matches.length} matches total</p>
            </div>
            {isAdmin && <button className="btn-primary-custom" onClick={() => setShowCreateModal(true)}>+ Schedule Match</button>}
          </div>
          <div className="d-flex gap-2 mt-4 flex-wrap">
            <button onClick={() => setFilterStatus('all')} style={{ padding: '6px 16px', borderRadius: 50, border: filterStatus === 'all' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', background: filterStatus === 'all' ? 'var(--pink-100)' : 'var(--pink-50)', color: filterStatus === 'all' ? 'var(--primary-dark)' : 'var(--text-muted)' }}>All</button>
            {['scheduled','ongoing','completed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '6px 16px', borderRadius: 50, border: filterStatus === s ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize', background: filterStatus === s ? 'var(--pink-100)' : 'var(--pink-50)', color: filterStatus === s ? 'var(--primary-dark)' : 'var(--text-muted)' }}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {loading && <div className="loading-overlay"><div className="spinner-custom"></div></div>}
        {!loading && filteredMatches.length === 0 && <div className="empty-state"><div className="empty-icon">📅</div><h5>No matches found</h5></div>}
        <div className="d-flex flex-column gap-3">
          {filteredMatches.map(m => (
            <div key={m._id} className="match-card">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div className="team-name-match" style={{ color: 'var(--text-dark)' }}>{m.team1?.name || 'TBD'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>{m.team1?.name?.charAt(0)}</div>
                </div>
                <div className="text-center px-3" style={{ minWidth: 140 }}>
                  {m.status === 'completed' ? (
                    <div className="match-score" style={{ color: 'var(--primary-dark)' }}>{m.score1} — {m.score2}</div>
                  ) : (
                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-light)' }}>VS</div>
                  )}
                  <div style={{ color: 'var(--text-body)', fontSize: '0.8rem', marginTop: 4, fontWeight: 500 }}>
                    {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  {m.venue && m.venue !== 'TBD' && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>📍 {m.venue}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="team-name-match" style={{ color: 'var(--text-dark)' }}>{m.team2?.name || 'TBD'}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="status-badge" style={{ background: statusColor[m.status]?.bg, color: statusColor[m.status]?.text, textTransform: 'capitalize' }}>{m.status}</span>
                  {isAdmin && m.status !== 'completed' && (
                    <button onClick={() => { setSelectedMatch(m); setScore({ score1: 0, score2: 0 }); setShowScoreModal(true); }}
                      style={{ padding: '6px 14px', borderRadius: 50, border: '1px solid var(--border)', background: 'var(--pink-100)', color: 'var(--primary-dark)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                      Enter Score
                    </button>
                  )}
                  {isAdmin && (
                    <button onClick={() => handleDelete(m._id)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>🗑️</button>
                  )}
                </div>
              </div>
              {m.winner && <div style={{ textAlign: 'center', marginTop: 12, color: 'var(--primary-dark)', background: 'var(--pink-100)', display: 'inline-block', padding: '4px 12px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700, border: '1px solid var(--border)', left: '50%', transform: 'translateX(-50%)', position: 'relative' }}>🏆 Winner: {m.winner?.name}</div>}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 12, textAlign: 'center' }}>🏆 {m.tournament?.name} · {m.round}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(80,7,36,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>📅 Schedule Match</h5>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {error && <div className="stms-alert mb-3">{error}</div>}
            <form onSubmit={handleCreate} className="stms-form-card" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
              <div className="mb-3">
                <label className="form-label">Tournament</label>
                <select className="form-select" required value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value, team1: '', team2: '' })}>
                  <option value="">Select tournament...</option>
                  {tournaments.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Team 1</label>
                  <select className="form-select" required value={form.team1} onChange={e => setForm({ ...form, team1: e.target.value })}>
                    <option value="">Select team...</option>
                    {teamsForTournament.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Team 2</label>
                  <select className="form-select" required value={form.team2} onChange={e => setForm({ ...form, team2: e.target.value })}>
                    <option value="">Select team...</option>
                    {teamsForTournament.filter(t => t._id !== form.team1).map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Match Date</label>
                  <input className="form-control" type="datetime-local" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="col-6">
                  <label className="form-label">Round</label>
                  <input className="form-control" placeholder="Group Stage" value={form.round} onChange={e => setForm({ ...form, round: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Venue</label>
                <input className="form-control" placeholder="Main Ground" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn-outline-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} disabled={submitting}>{submitting ? 'Scheduling...' : 'Schedule Match'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Score Modal */}
      {showScoreModal && selectedMatch && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(80,7,36,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-xl)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>⚽ Enter Score</h5>
              <button onClick={() => setShowScoreModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', marginBottom: 24, textAlign: 'center', fontWeight: 600 }}>{selectedMatch.team1?.name} vs {selectedMatch.team2?.name}</p>
            <form onSubmit={handleScoreUpdate} className="stms-form-card" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
              <div className="row g-4 mb-4">
                <div className="col-6 text-center">
                  <label className="form-label" style={{ color: 'var(--text-dark)' }}>{selectedMatch.team1?.name}</label>
                  <input className="form-control text-center" type="number" min={0} value={score.score1} onChange={e => setScore({ ...score, score1: +e.target.value })} style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', padding: '10px' }} />
                </div>
                <div className="col-6 text-center">
                  <label className="form-label" style={{ color: 'var(--text-dark)' }}>{selectedMatch.team2?.name}</label>
                  <input className="form-control text-center" type="number" min={0} value={score.score2} onChange={e => setScore({ ...score, score2: +e.target.value })} style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', padding: '10px' }} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn-outline-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} onClick={() => setShowScoreModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} disabled={submitting}>{submitting ? 'Saving...' : 'Save Result'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
