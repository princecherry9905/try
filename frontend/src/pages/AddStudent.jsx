import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateStudentForm } from '../utils/validation';
import './AddStudent.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://xstudent.onrender.com/api';

export default function AddStudent() {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    course: '',
    rollNo: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { isValid, errors } = validateStudentForm(formData);
    if (!isValid) {
      setFieldErrors(errors);
      setErrorMessage('Please correct the validation errors highlighted below.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const url = `${BASE_URL.replace(/\/+$/, '')}/students`;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          studentId: formData.studentId.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          course: formData.course.trim(),
          rollNo: formData.rollNo.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.message && data.message.includes('E11000')) {
          throw new Error('A student with this Student ID, Email, or Roll Number already exists.');
        }
        throw new Error(data.message || `Failed to create student (Status ${res.status})`);
      }

      setSuccessMessage('Student record enrolled successfully!');
      setTimeout(() => {
        navigate('/students');
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Error saving student record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      <div className="add-student-header">
        <Link to="/students" className="back-link">
          &larr; Back to Student Directory
        </Link>
        <h1 className="add-student-title">Enroll New Student</h1>
        <p className="add-student-subtitle">
          Submit verified student information into the institutional database.
        </p>
      </div>

      <div className="add-student-card">
        {errorMessage && (
          <div className="form-alert form-alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="form-alert form-alert-success" role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="studentId">
                Student ID <span className="req">*</span>
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                className={`form-input ${fieldErrors.studentId ? 'input-invalid' : ''}`}
                placeholder="e.g. STU-1001"
                value={formData.studentId}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.studentId)}
                aria-describedby={fieldErrors.studentId ? 'studentId-error' : undefined}
                required
              />
              {fieldErrors.studentId && (
                <span id="studentId-error" className="field-error" role="alert">
                  {fieldErrors.studentId}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rollNo">
                Roll Number <span className="req">*</span>
              </label>
              <input
                id="rollNo"
                name="rollNo"
                type="text"
                className={`form-input ${fieldErrors.rollNo ? 'input-invalid' : ''}`}
                placeholder="e.g. CS-2024-042"
                value={formData.rollNo}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.rollNo)}
                aria-describedby={fieldErrors.rollNo ? 'rollNo-error' : undefined}
                required
              />
              {fieldErrors.rollNo && (
                <span id="rollNo-error" className="field-error" role="alert">
                  {fieldErrors.rollNo}
                </span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="fullName">
                Full Name <span className="req">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className={`form-input ${fieldErrors.fullName ? 'input-invalid' : ''}`}
                placeholder="e.g. Aarav Sharma"
                value={formData.fullName}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                required
              />
              {fieldErrors.fullName && (
                <span id="fullName-error" className="field-error" role="alert">
                  {fieldErrors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Institutional Email <span className="req">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${fieldErrors.email ? 'input-invalid' : ''}`}
                placeholder="aarav@college.edu"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required
              />
              {fieldErrors.email && (
                <span id="email-error" className="field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="course">
                Academic Course / Branch <span className="req">*</span>
              </label>
              <input
                id="course"
                name="course"
                type="text"
                className={`form-input ${fieldErrors.course ? 'input-invalid' : ''}`}
                placeholder="e.g. B.Tech Computer Science"
                value={formData.course}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.course)}
                aria-describedby={fieldErrors.course ? 'course-error' : undefined}
                required
              />
              {fieldErrors.course && (
                <span id="course-error" className="field-error" role="alert">
                  {fieldErrors.course}
                </span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/students" className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving Student...' : 'Create Student Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
