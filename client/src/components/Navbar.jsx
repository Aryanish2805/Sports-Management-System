import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin, isManagerOrAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar navbar-expand-lg stms-navbar">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/" onClick={() => setExpanded(false)}>
          🏆 <span>TournamentPro</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{ color: 'var(--primary-dark)', fontSize: '1.3rem', padding: '4px 8px' }}
          aria-label="Toggle navigation"
        >
          {expanded ? '✕' : '☰'}
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-1">
            {[
              { path: '/',            label: '🏠 Home' },
              { path: '/tournaments', label: '🏆 Tournaments' },
              { path: '/teams',       label: '👥 Teams' },
              { path: '/matches',     label: '📅 Matches' },
              { path: '/leaderboard', label: '📊 Leaderboard' },
            ].map(({ path, label }) => (
              <li className="nav-item" key={path}>
                <Link
                  className={`nav-link ${isActive(path)}`}
                  to={path}
                  onClick={() => setExpanded(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth area */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                {/* Role badge */}
                {isAdmin && (
                  <span className="admin-badge" style={{ marginRight: 4 }}>
                    ⚙️ Admin
                  </span>
                )}
                {/* Dashboard link */}
                <Link
                  to="/dashboard"
                  className="nav-user-badge"
                  onClick={() => setExpanded(false)}
                >
                  {isAdmin ? '⚙️' : '👤'} {user.name.split(' ')[0]}
                </Link>
                {/* Logout */}
                <button className="nav-logout-btn" onClick={handleLogout}>
                  👋 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="nav-btn-login"  onClick={() => setExpanded(false)}>Login</Link>
                <Link to="/register" className="nav-btn-signup" onClick={() => setExpanded(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
