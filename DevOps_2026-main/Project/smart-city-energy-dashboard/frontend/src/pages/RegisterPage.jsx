import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register(form);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-visual register-visual">
        <span className="brand-eyebrow">Urban Sustainability Intelligence</span>
        <h1>Create analyst access</h1>
        <p>
          Register to explore energy consumption patterns, renewable contribution, and emissions
          forecasts across the monitored city building portfolio.
        </p>
      </div>
      <div className="auth-panel auth-form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <p>New accounts are created with analyst access. Admin role is managed separately.</p>
          {error ? <div className="form-error">{error}</div> : null}
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              minLength={6}
              required
            />
          </label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
          <div className="auth-links">
            <Link to="/login">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
