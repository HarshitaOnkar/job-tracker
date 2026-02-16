import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/saved', label: 'Saved' },
  { to: '/digest', label: 'Digest' },
  { to: '/settings', label: 'Settings' },
  { to: '/proof', label: 'Proof' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="kn-navbar">
      <div className="kn-navbar-inner">
        <NavLink to="/" className="kn-navbar-brand" onClick={closeMenu}>
          Job Notification Tracker
        </NavLink>

        <button
          className={`kn-hamburger ${menuOpen ? 'kn-hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className="kn-hamburger-line" />
          <span className="kn-hamburger-line" />
          <span className="kn-hamburger-line" />
        </button>

        <nav className={`kn-nav ${menuOpen ? 'kn-nav--open' : ''}`}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `kn-nav-link ${isActive ? 'kn-nav-link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
