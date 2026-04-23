import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const S = {
  root: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508', fontFamily: "'Poppins',sans-serif", padding: '40px 16px', position: 'relative', overflow: 'hidden' },
  blob1: { position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%)', top: -150, right: -100, pointerEvents: 'none' },
  blob2: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(129,140,248,0.06) 0%,transparent 70%)', bottom: -100, left: -80, pointerEvents: 'none' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' },
  card: { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 480, backdropFilter: 'blur(20px)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '13px 16px', color: '#f1f5f9', fontSize: '0.9rem', fontFamily: "'Poppins',sans-serif", outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' },
  label: { color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: 7, display: 'block', letterSpacing: 0.3 },
  btn: { width: '100%', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', border: 'none', color: '#fff', padding: '14px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Poppins',sans-serif", boxShadow: '0 8px 24px rgba(56,189,248,0.3)', transition: 'all 0.25s', letterSpacing: 0.3 },
};

const ROLES = [
  { value: 'spectator',    label: '👁️ Spectator',        desc: 'View tournaments, matches and standings', color: '#10b981' },
  { value: 'team_manager', label: '👥 Team Manager',      desc: 'Register and manage your team roster',   color: '#818cf8' },
  { value: 'admin',        label: '⚙️ Admin / Organizer', desc: 'Full access — create tournaments & schedule matches', color: '#38bdf8' },
];

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'spectator' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

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
      setError(err.response?.data?.message || 'Registration failed. Make sure the server is running on port 5000.');
    } finally { setLoading(false); }
  };

  const inputStyle = (field) => ({
    ...S.input,
    borderColor: focused === field ? '#38bdf8' : 'rgba(255,255,255,0.1)',
    boxShadow: focused === field ? '0 0 0 3px rgba(56,189,248,0.12)' : 'none',
  });

  return (
    <div style={S.root}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.grid} />

      <div style={S.card}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#38bdf8,#818cf8)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 14px', boxShadow: '0 8px 20px rgba(56,189,248,0.3)' }}>🎯</div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '1.55rem', margin: 0, letterSpacing: -0.5 }}>Create Account</h2>
          <p style={{ color: '#475569', fontSize: '0.87rem', margin: '6px 0 0' }}>Join the TournamentPro platform today</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: '0.83rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Full Name</label>
            <input type="text" placeholder="John Doe" value={form.name} required
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle('name')}
              onFocus={() => setFocused('name')} onBlur={() => setFocused('')} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={S.label}>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} required
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle('email')}
              onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} required
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle('password'), paddingRight: 48 }}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '1rem' }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: 26 }}>
            <label style={S.label}>Select Role</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROLES.map(r => {
                const sel = form.role === r.value;
                return (
                  <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s', background: sel ? `rgba(${r.value==='admin'?'56,189,248':r.value==='team_manager'?'129,140,248':'16,185,129'},0.08)` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${sel ? r.color : 'rgba(255,255,255,0.07)'}` }}>
                    <input type="radio" name="role" value={r.value} checked={sel}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      style={{ accentColor: r.color, width: 15, height: 15 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.87rem', color: sel ? '#f1f5f9' : '#64748b' }}>{r.label}</div>
                      <div style={{ fontSize: '0.74rem', color: sel ? '#94a3b8' : '#334155' }}>{r.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 30px rgba(56,189,248,0.45)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 24px rgba(56,189,248,0.3)'; }}>
            {loading ? '⏳ Creating account…' : '🚀 Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, color: '#475569', fontSize: '0.85rem', marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
