import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { to: '/', label: 'Dashboard' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/buildings', label: 'Buildings' },
    { to: '/predictions', label: 'Predictions' },
    { to: '/contact', label: 'Contact' },
  ];

  if (user?.role === 'admin') {
    navigation.push({ to: '/admin', label: 'Admin Panel' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-block">
          <span className="brand-eyebrow">Urban Intelligence</span>
          <h1>Smart City Energy</h1>
          <p>Building-scale monitoring for city-scale sustainability planning.</p>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="role-badge">{user?.role}</span>
          <span>{user?.name}</span>
        </div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <button type="button" className="menu-toggle" onClick={() => setSidebarOpen((current) => !current)}>
            Menu
          </button>
          <div className="topbar-title">
            <span>City Scale Energy Model</span>
            <strong>Live monitoring, analysis, and forecasts</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" className="ghost-button" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button type="button" className="primary-button slim" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
