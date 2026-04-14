import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [stats, setStats] = useState({ tournaments: 0, teams: 0, matches: 0, completed: 0 });
  const [recentTournaments, setRecentTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, mRes, teRes] = await Promise.all([
          API.get('/tournaments'),
          API.get('/matches'),
          API.get('/teams'),
        ]);
        setStats({
          tournaments: tRes.data.length,
          teams: teRes.data.length,
          matches: mRes.data.length,
          completed: mRes.data.filter(m => m.status === 'completed').length,
        });
        setRecentTournaments(tRes.data.slice(0, 4));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: '🏆', label: 'Tournaments', value: stats.tournaments, color: 'linear-gradient(135deg, #f9a8d4, #f472b6)' },
    { icon: '👥', label: 'Teams', value: stats.teams, color: 'linear-gradient(135deg, #f472b6, #ec4899)' },
    { icon: '📅', label: 'Matches', value: stats.matches, color: 'linear-gradient(135deg, #ec4899, #be185d)' },
    { icon: '✅', label: 'Completed', value: stats.completed, color: 'linear-gradient(135deg, #be185d, #9d174d)' },
  ];

  const sportEmoji = { Football: '⚽', Cricket: '🏏', Basketball: '🏀', Tennis: '🎾', Volleyball: '🏐', Other: '🏅' };
  
  if (loading) return (
    <div className="loading-overlay">
      <div className="spinner-custom"></div>
      <div className="loading-text">Loading dashboard...</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '92vh' }}>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <div style={{ color: 'var(--primary-dark)', fontSize: '0.85rem', marginBottom: 4, fontWeight: 600 }}>
                {isAdmin ? '⚙️ Admin Dashboard' : isManager ? '👥 Team Manager Dashboard' : '👁️ Spectator View'}
              </div>
              <h1 style={{ color: 'var(--text-dark)' }}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="d-flex gap-2">
              {isAdmin && (
                <Link to="/tournaments" className="btn-primary-custom" style={{ padding: '10px 24px' }}>
                  + New Tournament
                </Link>
              )}
              {isManager && (
                <Link to="/teams" className="btn-primary-custom" style={{ padding: '10px 24px' }}>
                  + Register Team
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Stat Cards */}
        <div className="row g-4 mb-5">
          {statCards.map((s, i) => (
            <div key={i} className="col-6 col-lg-3">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: s.color, color: '#fff' }}>
                  {s.icon}
                </div>
                <div className="stat-info">
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Tournaments */}
          <div className="col-lg-7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h5 style={{ fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>Recent Tournaments</h5>
              <Link to="/tournaments" style={{ color: 'var(--primary-dark)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>
                View all →
              </Link>
            </div>
            <div className="d-flex flex-column gap-3">
              {recentTournaments.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🏆</div>
                  <h5>No tournaments yet</h5>
                  <p>Check back later or create a new one.</p>
                </div>
              )}
              {recentTournaments.map((t) => (
                <Link to={`/tournaments/${t._id}`} key={t._id} style={{ textDecoration: 'none' }}>
                  <div className="match-card">
                    <div className="d-flex align-items-center gap-3">
                      <div className="stat-icon" style={{ background: 'var(--pink-100)', color: 'var(--primary-dark)' }}>
                        {sportEmoji[t.sport_type] || '🏅'}
                      </div>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: 700, marginBottom: 2, color: 'var(--text-dark)', fontSize: '1.05rem' }}>{t.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          📅 {new Date(t.start_date).toLocaleDateString()} — {new Date(t.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`status-badge status-${t.status}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-5">
            <h5 style={{ fontWeight: 800, marginBottom: 20, color: 'var(--text-dark)' }}>Quick Actions</h5>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: '🏆', label: 'All Tournaments', to: '/tournaments', desc: 'Browse & manage tournaments' },
                { icon: '👥', label: 'Teams', to: '/teams', desc: 'View registered teams' },
                { icon: '📅', label: 'Match Schedule', to: '/matches', desc: 'See upcoming matches' },
                { icon: '📊', label: 'Leaderboard', to: '/leaderboard', desc: 'Live standings & rankings' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ textDecoration: 'none' }}>
                  <div className="match-card d-flex align-items-center gap-3">
                    <div className="stat-icon" style={{ background: 'var(--pink-50)', color: 'var(--primary-dark)', width: 44, height: 44, fontSize: '1.2rem' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{item.label}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--primary-dark)', fontWeight: 800 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
