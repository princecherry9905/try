import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AppLayout.css';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = (() => {
    if (typeof window === 'undefined') return { name: 'Admin User', role: 'admin' };
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : { name: 'Admin User', role: 'admin' };
    } catch {
      return { name: 'Admin User', role: 'admin' };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Keyboard accessibility: Close mobile sidebar with ESC key
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="layout-root">
      {/* Skip to Main Content Link for Keyboard Users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="layout-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`layout-sidebar ${sidebarOpen ? 'open' : ''}`}
        aria-label="Main Navigation Sidebar"
      >
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">xSTUDENT</span>
          <span className="sidebar-role-badge">{user.role || 'user'}</span>
        </div>

        <nav className="sidebar-nav" aria-label="Application Sections">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            All Students
          </NavLink>

          <NavLink
            to="/students/new"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            Add Student
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            My Profile
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <span className="user-name">{user.name || 'User'}</span>
            <span className="user-email">{user.email || 'user@college.edu'}</span>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Log out of application"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="layout-main-wrapper">
        <header className="layout-topbar" aria-label="Portal Header">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
            aria-expanded={sidebarOpen}
          >
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
            <span className="hamburger-bar" />
          </button>

          <div className="topbar-title">Student Management Portal</div>

          <div className="topbar-user-badge" aria-label={`Logged in as ${user.name || 'User'}`}>
            <span className="avatar-circle" aria-hidden="true">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="avatar-label">{user.name || 'User'}</span>
          </div>
        </header>

        <main id="main-content" className="layout-content" tabIndex="-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
