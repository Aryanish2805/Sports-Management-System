import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const DEMO = [
  { role: '⚙️ Admin',   email: 'admin@sports.com',   password: 'Admin@123', color: '#38bdf8' },
  { role: '👥 Manager', email: 'manager@sports.com', password: 'User@123',  color: '#818cf8' },
  { role: '👁️ User',   email: 'user@sports.com',     password: 'User@123',  color: '#10b981' },
];

const S = {
  root: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508', fontFamily: "'Poppins',sans-serif", padding: '40px 16px', position: 'relative', overflow: 'hidden' },
  blob1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)', top: -150, right: -100, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(129,140,248,0.06) 0%,transparent 70%)', bottom: -100, left: -80, pointerEvents: 'none' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' },
  card: { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 440, backdropFilter: 'blur(20px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#f1f5f9', fontSize: '0.9rem', fontFamily: "'Poppins',sans-serif", outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
  label: { color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: 7, display: 'block', letterSpacing: 0.3 },
  btn: { width: '100%', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', border: 'none', color: '#fff', padding: '14px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 8px 24px rgba(56,189,248,0.3)', transition: 'all 0.25s', letterSpacing: 0.3 },
};

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPwd, setFocusPwd]     = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials and make sure the server is running.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.root}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.grid} />

      <div style={S.card}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#38bdf8,#818cf8)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 14px', boxShadow: '0 8px 20px rgba(56,189,248,0.3)' }}>🏆</div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.6rem', margin: 0, letterSpacing: -0.5 }}>Welcome back</h2>
          <p style={{ color: '#475569', fontSize: '0.88rem', margin: '6px 0 0' }}>Sign in to your TournamentPro account</p>
        </div>

        {/* Demo Credentials */}
        <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 24 }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.5, color: '#38bdf8', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            🔑 Demo Accounts — click to fill
          </div>
          {DEMO.map(acc => (
            <div key={acc.email} onClick={() => { setForm({ email: acc.email, password: acc.password }); setError(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 9, cursor: 'pointer', transition: 'background 0.15s', marginBottom: 4 }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <span style={{ background: acc.color, color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '2px 9px', borderRadius: 50, flexShrink: 0 }}>{acc.role}</span>
              <div style={{ flex: 1, fontSize: '0.73rem', color: '#94a3b8' }}>
                <strong style={{ color: '#cbd5e1' }}>{acc.email}</strong> · <span style={{ opacity: 0.7 }}>{acc.password}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, flexShrink: 0 }}>Use →</span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: '0.83rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address</label>
            <input id="login-email" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email"
              style={{ ...S.input, borderColor: focusEmail ? '#38bdf8' : 'rgba(255,255,255,0.1)', boxShadow: focusEmail ? '0 0 0 3px rgba(56,189,248,0.12)' : 'none' }}
              onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)} />
          </div>
          <div style={{ marginBottom: 26 }}>
            <label style={S.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input id="login-password" type={showPwd ? 'text' : 'password'} placeholder="Enter your password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password"
                style={{ ...S.input, paddingRight: 48, borderColor: focusPwd ? '#38bdf8' : 'rgba(255,255,255,0.1)', boxShadow: focusPwd ? '0 0 0 3px rgba(56,189,248,0.12)' : 'none' }}
                onFocus={() => setFocusPwd(true)} onBlur={() => setFocusPwd(false)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '1rem' }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button id="login-submit" type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(56,189,248,0.45)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(56,189,248,0.3)'; }}>
            {loading ? '⏳ Signing in…' : '🔐 Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, color: '#475569', fontSize: '0.85rem', marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>Create one →</Link>
        </p>

        {/* Server hint */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', marginTop: 18, fontSize: '0.72rem', color: '#334155', textAlign: 'center' }}>
          ⚡ Make sure the server is running: <code style={{ color: '#38bdf8' }}>cd server && npm start</code>
        </div>
      </div>
    </div>
  );
}
