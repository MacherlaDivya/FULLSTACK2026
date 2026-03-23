import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ContactPage = () => {
  const { user } = useAuth();
  const initialState = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
    }),
    [user?.email, user?.name]
  );
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      await api.post('/contact', form);
      setSuccess('Message submitted successfully. Admins can review it in the admin panel.');
      setForm(initialState);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-shell">
      <section className="contact-hero">
        <span className="brand-eyebrow">Contact and Collaboration</span>
        <h1>Discuss smart city energy modeling and dashboard operations</h1>
        <p>
          Send questions, support requests, or research feedback directly into the dashboard message
          store for admin review.
        </p>
        <div className="hero-actions">
          <Link className="ghost-button link-button" to={user ? '/' : '/login'}>
            {user ? 'Back to dashboard' : 'Go to login'}
          </Link>
        </div>
      </section>

      <section className="panel contact-panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          {success ? <div className="form-success full-span">{success}</div> : null}
          {error ? <div className="form-error full-span">{error}</div> : null}
          <label>
            Name
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="full-span">
            Subject
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} required />
          </label>
          <label className="full-span">
            Message
            <textarea
              rows="6"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
            />
          </label>
          <div className="full-span">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Send message'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;
