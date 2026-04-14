import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const colors = ['#f472b6', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6'];

const Teams = () => {
  const { isManagerOrAdmin, isAdmin } = useAuth();
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterTournament, setFilterTournament] = useState('all');
  const [form, setForm] = useState({ name: '', tournament: '', contact_info: '', members: '', logo_color: '#f472b6' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const filter = filterTournament !== 'all' ? `?tournament=${filterTournament}` : '';
      const [tRes, tourRes] = await Promise.all([API.get(`/teams${filter}`), API.get('/tournaments')]);
      setTeams(tRes.data);
      setTournaments(tourRes.data);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filterTournament]);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      const membersArr = form.members.split(',').map(m => m.trim()).filter(Boolean);
      await API.post('/teams', { ...form, members: membersArr });
      setShowModal(false);
      setForm({ name: '', tournament: '', contact_info: '', members: '', logo_color: '#f472b6' });
      fetchAll();
    } catch (err) { setError(err.response?.data?.message || 'Failed to register team'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this team?')) return;
    try { await API.delete(`/teams/${id}`); fetchAll(); } catch (e) { }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="section-tag mb-2">Teams</div>
              <h1 style={{ color: 'var(--text-dark)' }}>Registered Teams</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{teams.length} teams</p>
            </div>
            {isManagerOrAdmin && (
              <button className="btn-primary-custom" onClick={() => setShowModal(true)}>
                + Register Team
              </button>
            )}
          </div>
          <div className="d-flex gap-2 mt-4 flex-wrap">
            <button onClick={() => setFilterTournament('all')} style={{ padding: '6px 16px', borderRadius: 50, border: filterTournament === 'all' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', background: filterTournament === 'all' ? 'var(--pink-100)' : 'var(--pink-50)', color: filterTournament === 'all' ? 'var(--primary-dark)' : 'var(--text-muted)' }}>All Tournaments</button>
            {tournaments.map(t => (
              <button key={t._id} onClick={() => setFilterTournament(t._id)} style={{ padding: '6px 16px', borderRadius: 50, border: filterTournament === t._id ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', background: filterTournament === t._id ? 'var(--pink-100)' : 'var(--pink-50)', color: filterTournament === t._id ? 'var(--primary-dark)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {loading && <div className="loading-overlay"><div className="spinner-custom"></div></div>}
        {!loading && teams.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h5>No teams registered</h5>
            <p>{isManagerOrAdmin ? 'Register your team to participate.' : 'Teams will appear here once registered.'}</p>
          </div>
        )}
        <div className="row g-4">
          {teams.map(t => (
            <div key={t._id} className="col-md-6 col-lg-4">
              <div className="stms-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="team-avatar" style={{ background: t.logo_color || '#f472b6', width: 56, height: 56, fontSize: '1.3rem', borderRadius: 14 }}>{t.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{t.name}</div>
                    <div style={{ color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 600 }}>🏆 {t.tournament?.name}</div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-1 mb-3" style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                  <span>👤 Manager: {t.manager?.name}</span>
                  {t.contact_info && <span>📞 {t.contact_info}</span>}
                  <span>⚽ {t.tournament?.sport_type}</span>
                </div>
                {t.members?.length > 0 && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Players ({t.members.length})</div>
                    <div className="d-flex flex-wrap gap-1">
                      {t.members.slice(0, 6).map((m, i) => (
                        <span key={i} style={{ background: 'var(--pink-100)', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', color: 'var(--primary-dark)', fontWeight: 500 }}>{m}</span>
                      ))}
                      {t.members.length > 6 && <span style={{ background: 'var(--pink-50)', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>+{t.members.length - 6}</span>}
                    </div>
                  </div>
                )}
                {isAdmin && (
                  <button onClick={() => handleDelete(t._id)} style={{ marginTop: 16, width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: 'rgba(244,63,94,0.08)', color: '#e11d48', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>🗑️ Delete Team</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Team Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(80,7,36,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>👥 Register Team</h5>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {error && <div className="stms-alert mb-3">{error}</div>}
            <form onSubmit={handleCreate} className="stms-form-card" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input className="form-control" placeholder="Team Alpha" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Tournament</label>
                <select className="form-select" required value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value })}>
                  <option value="">Select tournament...</option>
                  {tournaments.map(t => <option key={t._id} value={t._id}>{t.name} ({t.sport_type})</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Info</label>
                <input className="form-control" placeholder="Phone or email" value={form.contact_info} onChange={e => setForm({ ...form, contact_info: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Players (comma separated)</label>
                <textarea className="form-control" rows={2} placeholder="Player 1, Player 2, Player 3..." value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="form-label">Team Color</label>
                <div className="d-flex gap-2 flex-wrap">
                  {colors.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, logo_color: c })}
                      style={{ width: 32, height: 32, borderRadius: 8, background: c, border: form.logo_color === c ? '3px solid var(--primary-dark)' : '2px solid transparent', cursor: 'pointer', boxShadow: form.logo_color === c ? '0 0 0 2px var(--pink-100)' : 'none' }} />
                  ))}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn-outline-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
