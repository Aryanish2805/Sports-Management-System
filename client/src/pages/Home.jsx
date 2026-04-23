import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';

const TICKER = [
  '🏏 LIVE · IIT Bombay 184/5 (19.2) vs IIT Delhi',
  '⚽ FT · SRM United FC 3 – 1 VIT Vellore FC',
  '🏏 LIVE · IIT Madras 110/2 (12) vs IIT Kanpur',
  '🏀 SCH · IIT Bombay Blazers vs VIT Chennai Bulls — Apr 28',
  '🏐 FT · Amrita Aces 3 – 1 NIT Calicut · Championship',
];

function useCounter(target, duration = 2000, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

const SPORTS = [
  { icon: '⚽', label: 'Football' },
  { icon: '🏀', label: 'Basketball' },
  { icon: '🏏', label: 'Cricket' },
  { icon: '🎾', label: 'Tennis' },
  { icon: '🏐', label: 'Volleyball' },
  { icon: '+ More', label: '' },
];

const FEATURES = [
  { icon: '🏆', title: 'Tournament Hub', path: '/tournaments', desc: 'Create multi-sport tournaments with bracket & league formats from one elegant dashboard.' },
  { icon: '👥', title: 'Team Registration', path: '/teams', desc: 'Streamlined roster management with role-based access for managers and players.' },
  { icon: '📅', title: 'Smart Scheduling', path: '/matches', desc: 'Conflict-free match scheduling that optimises venue usage automatically.' },
  { icon: '📊', title: 'Live Leaderboards', path: '/leaderboard', desc: 'Real-time standings, points tables and stats updated after every match.' },
  { icon: '🎯', title: 'Match Analytics', path: '/matches', desc: 'Deep performance insights and per-player stat breakdowns after every game.' },
  { icon: '🔔', title: 'Instant Alerts', path: '/dashboard', desc: 'Notifications for match start, score changes, and tournament milestones.' },
];

export default function Home() {
  const { user } = useAuth();
  const [tickerIdx, setTickerIdx] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);
  const statsRef = useRef(null);
  const [score, setScore] = useState({ runs: 142, wickets: 3, overs: 14, balls: 2 });

  const t = useCounter(2500, 2000, visibleStats);
  const teams = useCounter(450, 2000, visibleStats);
  const countries = useCounter(50, 1500, visibleStats);
  const rating = useCounter(49, 1800, visibleStats);

  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % TICKER.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setScore(prev => {
        const r = Math.random();
        let runs = prev.runs + (r < 0.05 ? 0 : [0,1,1,2,4,6][Math.floor(Math.random()*6)]);
        let wkts = prev.wickets + (r < 0.05 ? 1 : 0);
        let balls = prev.balls + 1;
        let overs = prev.overs + (balls >= 6 ? 1 : 0);
        balls = balls >= 6 ? 0 : balls;
        if (overs >= 20) return { runs: 142, wickets: 3, overs: 14, balls: 2 };
        return { runs, wickets: Math.min(wkts, 10), overs, balls };
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisibleStats(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#050508', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", overflowX: 'hidden' }}>

      {/* ── LIVE TICKER ── */}
      <div style={{ background: 'linear-gradient(90deg,#0f172a,#1e293b,#0f172a)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
        <span style={{ background: '#ef4444', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1, flexShrink: 0 }}>● LIVE</span>
        <div style={{ flex: 1, overflow: 'hidden', height: 20, position: 'relative' }}>
          {TICKER.map((item, i) => (
            <span key={i} style={{ position: 'absolute', left: 0, top: 0, opacity: i === tickerIdx ? 1 : 0, transform: i === tickerIdx ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.5s ease', whiteSpace: 'nowrap', color: '#cbd5e1' }}>{item}</span>
          ))}
        </div>
        <Link to="/matches" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700, flexShrink: 0 }}>Watch now →</Link>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', top: -150, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)', bottom: -100, left: -80, pointerEvents: 'none' }} />
        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '60px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

            {/* LEFT — Text */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', padding: '5px 16px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 24 }}>
                ✦ Built for Organizers. Loved by Athletes.
              </div>
              <h1 style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, color: '#f1f5f9', marginBottom: 20 }}>
                Run Tournaments<br />
                Like a <span style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Championship</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.75, maxWidth: 480, marginBottom: 36 }}>
                TournamentPro is the all-in-one platform to manage registrations, schedules, live scores, and standings — so you can focus on the game, not the admin.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link to={user ? '/tournaments' : '/register'} style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(56,189,248,0.35)', transition: 'all 0.25s' }}>
                  Start Your Tournament →
                </Link>
                <Link to="/dashboard" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#cbd5e1', padding: '14px 28px', borderRadius: 50, fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.25s' }}>
                  📋 Book a Demo
                </Link>
              </div>
              {/* Supported Sports */}
              <div>
                <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Supported Sports</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {SPORTS.map((s, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#94a3b8', padding: '6px 16px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 600, cursor: 'default', transition: 'all 0.2s' }}>
                      {s.icon} {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — App Preview Card */}
            <div style={{ position: 'relative' }}>
              {/* Glow behind card */}
              <div style={{ position: 'absolute', inset: -30, background: 'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)', borderRadius: 40, pointerEvents: 'none' }} />
              <div style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(56,189,248,0.1)', position: 'relative', animation: 'floatCard 6s ease-in-out infinite' }}>
                {/* Window bar */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'block' }} />
                  <span style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>TournamentPro — Dashboard</span>
                  <span style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8', padding: '2px 10px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700 }}>● LIVE</span>
                </div>
                <div style={{ padding: 20, display: 'flex', gap: 14 }}>
                  {/* Sidebar */}
                  <div style={{ width: 44, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', paddingTop: 8 }}>
                    {['🏠','🏆','⚽','👥','📊','⚙️'].map((ic,i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: i===1?'rgba(56,189,248,0.2)':'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', cursor: 'pointer', border: i===1?'1px solid rgba(56,189,248,0.3)':'1px solid transparent' }}>{ic}</div>
                    ))}
                  </div>
                  {/* Main panel */}
                  <div style={{ flex: 1, display: 'flex', gap: 12, flexDirection: 'column' }}>
                    {/* Ongoing tournament */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#f1f5f9' }}>Inter-IIT Cricket Championship</div>
                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Apr 1 – May 3 · 8 Teams · Group Stage</div>
                        </div>
                        <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 6, fontSize: '0.62rem', fontWeight: 700 }}>ONGOING</span>
                      </div>
                      {/* Mini bracket */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[['IIT Bombay','IIT Delhi',185,142],['IIT Madras','IIT KGP',210,178]].map(([t1,t2,s1,s2],i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}><span>{t1}</span><span style={{ color: '#38bdf8', fontWeight: 800 }}>{s1}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8' }}><span>{t2}</span><span>{s2}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Live score + upcoming */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {/* Live */}
                      <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 12, padding: '12px 14px' }}>
                        <div style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>● LIVE SCORE</div>
                        <div style={{ fontWeight: 900, fontSize: '1.6rem', color: '#f1f5f9', letterSpacing: -1 }}>{score.runs}/{score.wickets}</div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: 4 }}>IIT Bombay · {score.overs}.{score.balls} Ov</div>
                      </div>
                      {/* Leaderboard mini */}
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px' }}>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>STANDINGS</div>
                        {[['IIT Bombay',18],['IIT Madras',15],['IIT Delhi',12]].map(([n,pts],i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: 4 }}>
                            <span>{i+1}. {n}</span><span style={{ color: i===0?'#38bdf8':'#64748b', fontWeight: 700 }}>{pts}pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '52px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
            {[
              { n: t, suf: '+', label: 'Tournaments Managed', icon: '🛡️' },
              { n: teams, suf: 'K+', label: 'Teams Registered', icon: '👥' },
              { n: countries, suf: '+', label: 'Countries', icon: '🌐' },
              { n: rating, suf: '/5', label: 'Organizer Rating', icon: '⭐', div: 10 },
            ].map(({ n, suf, label, icon, div }) => (
              <div key={label} style={{ padding: 20, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f1f5f9', letterSpacing: -2, lineHeight: 1 }}>
                  {div ? (n / div).toFixed(1) : n.toLocaleString()}{suf}
                </div>
                <div style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', padding: '4px 16px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Our Platform</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: -1.5, marginBottom: 14 }}>Everything You Need</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.65, maxWidth: 500, margin: '0 auto' }}>From signups to final whistle — every corner of tournament management covered.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <Link to={f.path} key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(56,189,248,0.25)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.4),0 0 30px rgba(56,189,248,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow='none'; }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f5f9', marginBottom: 10 }}>{f.title}</div>
                <p style={{ fontSize: '0.87rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)', padding: '90px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.9rem,4vw,3.2rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: -1.5, marginBottom: 14 }}>Ready to Play? 🏆</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.65, maxWidth: 480, margin: '0 auto 36px' }}>Join the most powerful sports management platform and take your tournament to the next level.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', padding: '15px 38px', borderRadius: 50, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 8px 30px rgba(56,189,248,0.4)' }}>🚀 Get Started Free</Link>
            <Link to="/tournaments" style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '15px 38px', borderRadius: 50, fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>View Tournaments</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#030305', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '44px 0 24px' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: '1.4rem', background: 'linear-gradient(135deg,#38bdf8,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>🏆 TournamentPro</div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[['Tournaments','/tournaments'],['Teams','/teams'],['Matches','/matches'],['Leaderboard','/leaderboard']].map(([label,path]) => (
              <Link key={label} to={path} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.86rem', fontWeight: 500 }}>{label}</Link>
            ))}
          </div>
          <div style={{ color: '#1e293b', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 18, width: '100%' }}>© 2026 TournamentPro · All rights reserved</div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes floatCard {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
