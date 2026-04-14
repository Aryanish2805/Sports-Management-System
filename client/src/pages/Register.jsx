import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'spectator' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'spectator', label: '👁️ Spectator', desc: 'View tournaments, matches and standings' },
    { value: 'team_manager', label: '👥 Team Manager', desc: 'Register and manage your team' },
    { value: 'admin', label: '⚙️ Admin / Organizer', desc: 'Full access — create tournaments, schedule matches' },
  ];

  return (
    <div style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      padding: '40px 0',
      background: 'var(--grad-hero)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '2.5rem', marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(244,114,182,0.3))' }}>🎯</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px', color: 'var(--text-dark)' }}>
                Create Account
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the TournamentPro platform</p>
            </div>
            <div className="stms-form-card">
              {error && <div className="stms-alert mb-4">⚠️ {error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">📝 Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">📧 Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">🔒 Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ paddingRight: 48 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--primary-dark)', fontSize: '1rem',
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">🎭 Select Role</label>
                  <div className="d-flex flex-column gap-2">
                    {roles.map((r) => {
                      const isSelected = form.role === r.value;
                      return (
                        <label key={r.value} style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                          borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                          background: isSelected ? 'var(--pink-100)' : 'var(--pink-50)',
                          border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                        }}>
                          <input
                            type="radio"
                            name="role"
                            value={r.value}
                            checked={isSelected}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? 'var(--primary-dark)' : 'var(--text-dark)' }}>{r.label}</div>
                            <div style={{ color: isSelected ? 'var(--primary-dark)' : 'var(--text-muted)', fontSize: '0.78rem', filter: isSelected ? 'opacity(0.8)' : 'none' }}>{r.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center"
                  disabled={loading}
                  style={{ padding: '13px', borderRadius: 50, fontSize: '0.95rem' }}
                >
                  {loading ? '⏳ Creating account…' : '🚀 Create Account'}
                </button>
              </form>
              <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
