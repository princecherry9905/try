import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateAuthForm } from '../utils/validation';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleFieldChange = (field, setter) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { isValid, errors } = validateAuthForm({
      name,
      email,
      password,
      confirmPassword,
      isRegister: true,
    });

    if (!isValid) {
      setFieldErrors(errors);
      setErrorMessage('Please correct the validation errors highlighted below.');
      return;
    }

    setFieldErrors({});

    try {
      await register(name.trim(), email.trim(), password, role);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-sidebar">
        <span className="auth-sidebar-badge">JOIN xSTUDENT</span>
        <h1 className="auth-sidebar-title">Create Your Student Account</h1>
        <p className="auth-sidebar-desc">
          Register with your institutional email to access student records, view attendance
          percentages, track results, and receive real-time updates.
        </p>
      </aside>

      <main className="auth-content">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p className="auth-form-subtitle">Fill in your information to get started</p>
          </div>

          {errorMessage && (
            <div className="auth-alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="auth-alert-success" role="status">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className={`auth-input ${fieldErrors.name ? 'input-invalid' : ''}`}
                placeholder="Riya Sharma"
                value={name}
                onChange={handleFieldChange('name', setName)}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? 'reg-name-error' : undefined}
                required
              />
              {fieldErrors.name && (
                <span id="reg-name-error" className="field-error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className={`auth-input ${fieldErrors.email ? 'input-invalid' : ''}`}
                placeholder="riya@college.edu"
                value={email}
                onChange={handleFieldChange('email', setEmail)}
                autoComplete="email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                required
              />
              {fieldErrors.email && (
                <span id="reg-email-error" className="field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password (min 6 characters)</label>
              <input
                id="reg-password"
                type="password"
                className={`auth-input ${fieldErrors.password ? 'input-invalid' : ''}`}
                placeholder="Create a strong password"
                value={password}
                onChange={handleFieldChange('password', setPassword)}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'reg-password-error' : undefined}
                required
              />
              {fieldErrors.password && (
                <span id="reg-password-error" className="field-error" role="alert">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                className={`auth-input ${fieldErrors.confirmPassword ? 'input-invalid' : ''}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleFieldChange('confirmPassword', setConfirmPassword)}
                autoComplete="new-password"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'reg-confirm-error' : undefined}
                required
              />
              {fieldErrors.confirmPassword && (
                <span id="reg-confirm-error" className="field-error" role="alert">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="reg-role">Account Role</label>
              <select
                id="reg-role"
                className="auth-input auth-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Student / General User</option>
                <option value="admin">Administrator (Admin Access)</option>
              </select>
              <span className="auth-role-hint">
                {role === 'admin'
                  ? '👑 Admin privileges: Full permission to enroll, edit, and delete student records.'
                  : '🎓 Student privileges: Access directory and view academic records.'}
              </span>
            </div>

            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="auth-switch-text">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
