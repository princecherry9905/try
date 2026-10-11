import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Brand logo with graduation cap icon */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <svg
            className="bi bi-mortarboard-fill navbar-logo-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917z" />
            <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466z" />
          </svg>
          <span className="navbar-brand-text">xSTUDENT</span>
        </Link>

        {/* Mobile menu toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={`toggler-icon ${mobileMenuOpen ? 'open' : ''}`} />
        </button>

        {/* Navigation links & CTA action buttons */}
        <div className={`navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/#features" className="nav-link" onClick={closeMobileMenu}>
                Features
              </a>
            </li>
            <li className="nav-item">
              <a href="/#tech-stack" className="nav-link" onClick={closeMobileMenu}>
                Tech Stack
              </a>
            </li>
          </ul>

          <div className="navbar-actions">
            <Link to="/login" className="btn btn-outline-light" onClick={closeMobileMenu}>
              Sign In
            </Link>
            <Link to="/dashboard" className="btn btn-primary" onClick={closeMobileMenu}>
              Live App Demo
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
