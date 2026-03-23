import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-visual">
        <span className="brand-eyebrow">Research Driven Urban Modeling</span>
        <h1>Smart City Energy Management Dashboard</h1>
        <p>
          Monitor city-scale building energy demand, renewable generation, and CO2 emissions with
          real-time analytics and forecasting.
        </p>
      </div>
      <div className="auth-panel auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p>Use the seeded admin or analyst account, or create a new user account.</p>
          {error ? <div className="form-error">{error}</div> : null}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="admin@smartcity.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter password"
              required
            />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <div className="auth-links">
            <Link to="/register">Create account</Link>
            <Link to="/contact">Contact team</Link>
          </div>
          <div className="seed-note">
            <strong>Demo credentials</strong>
            <span>Admin: admin@smartcity.com / Admin@123</span>
            <span>User: user@smartcity.com / User@123</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
