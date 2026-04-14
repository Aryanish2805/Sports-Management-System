import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/* Quick-fill credentials for demo */
const DEMO_ACCOUNTS = [
  {
    role: '⚙️ Admin',
    email: 'admin@sports.com',
    password: 'Admin@123',
    name: 'Admin',
  },
  {
    role: '👁️ User',
    email: 'user@sports.com',
    password: 'User@123',
    name: 'User',
  },
];

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (acc) => {
    setForm({ email: acc.email, password: acc.password });
    setError('');
  };

  return (
    <div style={{
      minHeight: '92vh',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--grad-hero)',
      padding: '40px 0',
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">

            {/* Header */}
            <div className="text-center mb-4">
              <div style={{ fontSize: '2.6rem', marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(244,114,182,0.3))' }}>🏆</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.65rem', letterSpacing: '-0.5px', color: 'var(--text-dark)' }}>
                Welcome back!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 0 }}>
                Sign in to your TournamentPro account
              </p>
            </div>

            <div className="stms-form-card">

              {/* Demo Credentials */}
              <div className="credentials-card">
                <h6>
                  <span>🔑</span> Demo Accounts — click to fill
                </h6>
                {DEMO_ACCOUNTS.map((acc) => (
                  <div
                    key={acc.email}
                    className="credentials-row"
                    onClick={() => fillCredentials(acc)}
                    title={`Fill ${acc.role} credentials`}
                  >
                    <span className="role-tag">{acc.role}</span>
                    <div className="cred-info">
                      <strong>{acc.email}</strong><br />
                      <span style={{ opacity: 0.7 }}>{acc.password}</span>
                    </div>
                    <button className="use-btn" type="button" onClick={(e) => { e.stopPropagation(); fillCredentials(acc); }}>
                      Use →
                    </button>
                  </div>
                ))}
              </div>

              {/* Error */}
              {error && <div className="stms-alert mb-4">⚠️ {error}</div>}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">📧 Email Address</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">🔒 Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPwd ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      autoComplete="current-password"
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

                <button
                  id="login-submit"
                  type="submit"
                  className="btn-primary-custom w-100 justify-content-center"
                  disabled={loading}
                  style={{ padding: '13px', borderRadius: 50, fontSize: '0.95rem' }}
                >
                  {loading ? '⏳ Signing in…' : '🔐 Sign In'}
                </button>
              </form>

              <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginBottom: 0 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary-dark)', fontWeight: 700, textDecoration: 'none' }}>
                  Create one →
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
