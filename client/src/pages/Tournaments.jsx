import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const sportEmoji = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐', Other: '🏅' };
const sportColor = {
  Football: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
  Cricket: 'linear-gradient(135deg, #f472b6, #ec4899)',
  Basketball: 'linear-gradient(135deg, #ec4899, #be185d)',
  Tennis: 'linear-gradient(135deg, #be185d, #9d174d)',
  Volleyball: 'linear-gradient(135deg, #9d174d, #831843)',
  Other: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
};

const statusColor = { 
  upcoming: { bg: 'rgba(244,114,182,0.15)', text: '#be185d' }, 
  ongoing: { bg: 'rgba(236,72,153,0.15)', text: '#9d174d' }, 
  completed: { bg: 'rgba(157,23,77,0.15)', text: '#831843' } 
};

const Tournaments = () => {
  const { isAdmin } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', sport_type: 'Football', description: '', start_date: '', end_date: '', max_teams: 8, format: 'league' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const { data } = await API.get('/tournaments');
      setTournaments(data);
    } catch (e) { } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      await API.post('/tournaments', form);
      setShowModal(false);
      setForm({ name: '', sport_type: 'Football', description: '', start_date: '', end_date: '', max_teams: 8, format: 'league' });
      fetch();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create tournament'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tournament?')) return;
    try { await API.delete(`/tournaments/${id}`); fetch(); } catch (e) { }
  };

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t => t.status === filter);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div className="section-tag mb-2">Tournaments</div>
              <h1 style={{ color: 'var(--text-dark)' }}>All Tournaments</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{tournaments.length} tournaments found</p>
            </div>
            {isAdmin && (
              <button className="btn-primary-custom" onClick={() => setShowModal(true)}>
                + Create Tournament
              </button>
            )}
          </div>
          {/* Filter tabs */}
          <div className="d-flex gap-2 mt-4">
            {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '6px 18px', borderRadius: 50, border: filter === f ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', 
                  fontWeight: 600, fontSize: '0.8rem', textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === f ? 'var(--pink-100)' : 'var(--pink-50)',
                  color: filter === f ? 'var(--primary-dark)' : 'var(--text-muted)',
                }}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {loading && <div className="loading-overlay"><div className="spinner-custom"></div></div>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h5>No tournaments found</h5>
            <p>{isAdmin ? 'Create your first tournament to get started.' : 'Check back later for upcoming tournaments.'}</p>
          </div>
        )}
        <div className="row g-4">
          {filtered.map((t) => (
            <div key={t._id} className="col-md-6 col-lg-4">
              <div className="tournament-card">
                <div className="tournament-card-top" style={{ background: sportColor[t.sport_type] || sportColor.Other }}></div>
                <div className="tournament-card-body">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <span style={{ fontSize: '2rem' }}>{sportEmoji[t.sport_type] || '🏅'}</span>
                    <span className="status-badge" style={{ background: statusColor[t.status]?.bg, color: statusColor[t.status]?.text, textTransform: 'capitalize' }}>
                      {t.status}
                    </span>
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1.05rem', color: 'var(--text-dark)' }}>{t.name}</h5>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.5 }}>
                    {t.description || `${t.sport_type} Tournament`}
                  </p>
                  <div className="d-flex flex-column gap-1 mb-4" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>📅 {new Date(t.start_date).toLocaleDateString('en-IN')} – {new Date(t.end_date).toLocaleDateString('en-IN')}</span>
                    <span>🔢 Max {t.max_teams} teams • {t.format?.replace('_', ' ')}</span>
                    <span style={{color: 'var(--primary-dark)'}}>👤 Organized by {t.organizer?.name || 'Admin'}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/tournaments/${t._id}`} className="btn-primary-custom flex-grow-1 justify-content-center" style={{ padding: '9px 12px', fontSize: '0.85rem', borderRadius: 8 }}>
                      View Details
                    </Link>
                    {isAdmin && (
                      <button onClick={() => handleDelete(t._id)} style={{ padding: '9px 14px', borderRadius: 8, border: 'none', background: 'rgba(244,63,94,0.1)', color: '#e11d48', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Tournament Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(80,7,36,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20, backdropFilter: 'blur(6px)' }}>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0, color: 'var(--text-dark)' }}>🏆 Create Tournament</h5>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {error && <div className="stms-alert mb-3">{error}</div>}
            <form onSubmit={handleCreate} className="stms-form-card" style={{ padding: 0, background: 'none', border: 'none', boxShadow: 'none' }}>
              <div className="mb-3">
                <label className="form-label">Tournament Name</label>
                <input className="form-control" placeholder="Annual Cup 2026" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Sport Type</label>
                  <select className="form-select" value={form.sport_type} onChange={e => setForm({ ...form, sport_type: e.target.value })}>
                    {['Football','Cricket','Basketball','Tennis','Volleyball','Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Format</label>
                  <select className="form-select" value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
                    <option value="league">League</option>
                    <option value="knockout">Knockout</option>
                    <option value="group_stage">Group Stage</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} placeholder="Brief description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Start Date</label>
                  <input className="form-control" type="date" required value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div className="col-6">
                  <label className="form-label">End Date</label>
                  <input className="form-control" type="date" required value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Max Teams</label>
                <input className="form-control" type="number" min={2} max={32} value={form.max_teams} onChange={e => setForm({ ...form, max_teams: e.target.value })} />
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn-outline-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-custom flex-grow-1 justify-content-center" style={{ padding: '11px' }} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Tournament'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
