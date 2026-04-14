import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';

/* ── Fake live ticker data ── */
const TICKER_ITEMS = [
  '🔴 LIVE · FC Blossoms 3 – 1 Pink Panthers',
  '🏀 Halftime · Rose City Ballers vs Magenta Hawks',
  '⚽ FT · Flamingo United 2 – 2 Petal FC',
  '🏏 LIVE · Pink Warriors 87/3 (14 overs)',
  '🎾 Set 3 · L. Rosenfeld 6–4 · A. Florens 3–6',
  '🏐 LIVE · Blossom Spikers 18 – 22 Neon Roses',
];

/* ── Animated counter hook ── */
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

const FEATURES = [
  { icon: '🏆', title: 'Tournament Hub', desc: 'Create and manage multi-sport tournaments with bracket and league formats in one elegant dashboard.' },
  { icon: '👥', title: 'Team Registration', desc: 'Streamlined roster management with role-based access for managers, players, and spectators.' },
  { icon: '📅', title: 'Smart Scheduling', desc: 'AI-assisted match scheduling that avoids conflicts and optimises venue usage automatically.' },
  { icon: '📊', title: 'Live Leaderboards', desc: 'Real-time score updates with auto-recalculated standings, points tables, and stats.' },
  { icon: '🎯', title: 'Match Analytics', desc: 'Deep performance insights, heatmaps and per-player stat breakdowns after every game.' },
  { icon: '🔔', title: 'Instant Alerts', desc: 'Push & email notifications for match start, score changes, and tournament milestones.' },
];

const SPORTS = ['⚽ Football', '🏏 Cricket', '🏀 Basketball', '🎾 Tennis', '🏐 Volleyball', '🏑 Hockey', '🏸 Badminton', '🥊 Boxing'];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Team Manager · FC Blossoms', text: '"TournamentPro made running our league effortless. The live standings update instantly — our fans are obsessed!"' },
  { name: 'Rahul Mehta', role: 'Tournament Director · Pink Circuit', text: '"From scheduling to results, everything is seamless. I cut admin time by 70% in the very first season."' },
  { name: 'Aisha Khan', role: 'Head Coach · Rose City Ballers', text: '"The analytics helped us identify weaknesses and we won the championship. Incredible platform!"' },
];

export default function Home() {
  const { user } = useAuth();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [visibleStats, setVisibleStats] = useState(false);
  const statsRef = useRef(null);

  const tournaments = useCounter(48, 1800, visibleStats);
  const teams      = useCounter(320, 2000, visibleStats);
  const matches    = useCounter(1240, 2200, visibleStats);
  const countries  = useCounter(18, 1200, visibleStats);

  /* Rotate ticker */
  useEffect(() => {
    const id = setInterval(() => setTickerIndex(i => (i + 1) % TICKER_ITEMS.length), 3500);
    return () => clearInterval(id);
  }, []);

  /* Trigger counter when stats section enters viewport */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisibleStats(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hp-root">

      {/* ══════════ LIVE TICKER ══════════ */}
      <div className="hp-ticker">
        <span className="hp-ticker-label">🔴 LIVE</span>
        <div className="hp-ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className={`hp-ticker-item ${i === tickerIndex ? 'active' : ''}`}>{item}</span>
          ))}
        </div>
        <span className="hp-ticker-dot" />
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="hp-hero">
        {/* Pink blob decorations */}
        <div className="hp-blob hp-blob-1" />
        <div className="hp-blob hp-blob-2" />
        <div className="hp-blob hp-blob-3" />

        <div className="hp-hero-inner container">
          <div className="hp-hero-text">
            <div className="hp-badge">✨ The #1 Sports Platform</div>
            <h1 className="hp-hero-title">
              Manage Sports<br />
              <span className="hp-gradient-text">Like a Pro</span>
            </h1>
            <p className="hp-hero-sub">
              A centralized pink-powered platform for elite sports tournaments — handle team registrations, live scheduling, and real-time standings all from one stunning dashboard.
            </p>
            <div className="hp-hero-cta">
              <Link to="/tournaments" className="hp-btn-primary">🏟️ Explore Tournaments</Link>
              {!user && (
                <Link to="/register" className="hp-btn-outline">Register Your Team</Link>
              )}
            </div>
            <div className="hp-hero-pills">
              {SPORTS.map(s => <span key={s} className="hp-pill">{s}</span>)}
            </div>
          </div>

          <div className="hp-hero-visual">
            {/* Main image with live overlay effects */}
            <div className="hp-hero-img-wrap">
              <img src="/hero-sports.png" alt="Sports Arena" className="hp-hero-img" />
              {/* Animated pink-blue gradient overlay */}
              <div className="hp-hero-img-glow" />
              <div className="hp-img-overlay" />
              {/* Animated neon pulse rings */}
              <div className="hp-pulse-ring hp-pulse-ring-1" />
              <div className="hp-pulse-ring hp-pulse-ring-2" />
              <div className="hp-pulse-ring hp-pulse-ring-3" />
              {/* Floating particles */}
              <div className="hp-particle hp-p1" />
              <div className="hp-particle hp-p2" />
              <div className="hp-particle hp-p3" />
              <div className="hp-particle hp-p4" />
              <div className="hp-particle hp-p5" />
              {/* Neon corner accents */}
              <div className="hp-corner hp-corner-tl" />
              <div className="hp-corner hp-corner-br" />
              {/* Live badge on image */}
              <div className="hp-img-live-badge">
                <span className="hp-live-blink" />
                LIVE NOW
              </div>
            </div>
            {/* Floating live card */}
            <div className="hp-float-card hp-float-card-top">
              <span className="hp-live-dot" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>FC Blossoms vs Pink Panthers</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Quarter Final · 73&#39;</div>
              </div>
              <div className="hp-float-score">3 – 1</div>
            </div>
            <div className="hp-float-card hp-float-card-bot">
              <span style={{ fontSize: '1.4rem' }}>🏆</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Pink Cup 2026</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>32 teams competing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="hp-stats" ref={statsRef}>
        <div className="container">
          <div className="hp-stats-grid">
            {[
              { n: tournaments, suffix: '+', label: 'Tournaments Hosted' },
              { n: teams,       suffix: '+', label: 'Registered Teams' },
              { n: matches,     suffix: '+', label: 'Matches Played' },
              { n: countries,   suffix: '',  label: 'Countries' },
            ].map(({ n, suffix, label }) => (
              <div className="hp-stat-box" key={label}>
                <div className="hp-stat-num">{n.toLocaleString()}{suffix}</div>
                <div className="hp-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="hp-section">
        <div className="container">
          <div className="hp-sec-header">
            <span className="hp-sec-tag">Our Platform</span>
            <h2 className="hp-sec-title">Everything You Need</h2>
            <p className="hp-sec-sub">From signups to final whistle — we have every corner of tournament management covered.</p>
          </div>
          <div className="hp-features-grid">
            {FEATURES.map((f, i) => (
              <div className="hp-feature-card" key={i} style={{ '--delay': `${i * 80}ms` }}>
                <div className="hp-feature-icon">{f.icon}</div>
                <h4 className="hp-feature-title">{f.title}</h4>
                <p className="hp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="hp-section hp-testimonials-section">
        <div className="container">
          <div className="hp-sec-header">
            <span className="hp-sec-tag">Community</span>
            <h2 className="hp-sec-title">Loved by Champions</h2>
          </div>
          <div className="hp-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="hp-testimonial-card" key={i}>
                <div className="hp-testimonial-stars">★★★★★</div>
                <p className="hp-testimonial-text">{t.text}</p>
                <div className="hp-testimonial-author">
                  <div className="hp-testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="hp-testimonial-name">{t.name}</div>
                    <div className="hp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className="hp-cta-section">
        <div className="hp-cta-blobs">
          <div className="hp-cta-blob hp-cta-blob-1" />
          <div className="hp-cta-blob hp-cta-blob-2" />
        </div>
        <div className="container hp-cta-inner">
          <h2 className="hp-cta-title">Ready to Play? 🏆</h2>
          <p className="hp-cta-sub">Join the most vibrant sports management platform and take your tournament to the next level.</p>
          <div className="hp-cta-btns">
            <Link to="/register" className="hp-btn-primary hp-btn-lg">🚀 Get Started Free</Link>
            <Link to="/tournaments" className="hp-btn-white">View Tournaments</Link>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="hp-footer">
        <div className="container hp-footer-inner">
          <div className="hp-footer-brand">
            <span className="hp-footer-logo">🏆 TournamentPro</span>
            <p className="hp-footer-tagline">The pink-powered home of sports management.</p>
          </div>
          <div className="hp-footer-links">
            <Link to="/tournaments">Tournaments</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>
          <div className="hp-footer-copy">© 2026 TournamentPro · All rights reserved</div>
        </div>
      </footer>
    </div>
  );
}
