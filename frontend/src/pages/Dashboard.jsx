import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = user || {
    name: 'Academic User',
    email: 'user@college.edu',
    role: 'admin',
  };

  const isAdmin = currentUser.role?.toLowerCase() === 'admin';

  useEffect(() => {
    let ignore = false;

    async function fetchDashboardData() {
      try {
        const url = `${BASE_URL.replace(/\/+$/, '')}/students`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to load dashboard metrics (Status ${res.status})`);
        }

        const data = await res.json();
        if (!ignore) {
          const studentList = Array.isArray(data.students) ? data.students : [];
          setStudents(studentList);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Error connecting to student backend.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      ignore = true;
    };
  }, []);

  const totalCount = students.length;
  const courseSet = new Set();
  students.forEach((s) => {
    if (s.course) courseSet.add(s.course.trim());
  });
  const totalCourses = courseSet.size;

  const recentStudents = students.slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {currentUser.name || 'User'}!
          </h1>
          <p className="dashboard-subtitle">
            Academic overview and student lifecycle management portal.
          </p>
        </div>
        <div className="role-pill-badge" data-role={currentUser.role || 'user'}>
          <span className="role-dot" />
          Role: <strong className="role-name">{currentUser.role || 'User'}</strong>
        </div>
      </div>

      <div className={`role-notice-card ${isAdmin ? 'notice-admin' : 'notice-student'}`}>
        <div className="notice-icon">{isAdmin ? '🛡️' : '🎓'}</div>
        <div className="notice-content">
          <h4>{isAdmin ? 'Administrator Privileges Enabled' : 'Student & Member Portal'}</h4>
          <p>
            {isAdmin
              ? 'You have administrative authority to enroll students, modify academic records, and supervise institution accounts.'
              : 'You can explore directory listings, view course curriculum details, and manage your account credentials.'}
          </p>
        </div>
        {isAdmin && (
          <Link to="/students/new" className="btn-notice-action">
            + Quick Enroll
          </Link>
        )}
      </div>

      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap icon-blue">
            <span>👨‍🎓</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Enrolled</span>
            <div className="metric-value">
              {loading ? '...' : totalCount}
            </div>
            <span className="metric-trend">Verified Students</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-purple">
            <span>📚</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Courses</span>
            <div className="metric-value">
              {loading ? '...' : totalCourses}
            </div>
            <span className="metric-trend">Academic Programs</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-emerald">
            <span>⚡</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Access Level</span>
            <div className="metric-value role-text">
              {isAdmin ? 'Admin' : 'Student'}
            </div>
            <span className="metric-trend">JWT Authenticated</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap icon-amber">
            <span>🌐</span>
          </div>
          <div className="metric-info">
            <span className="metric-label">Service Health</span>
            <div className="metric-value status-indicator">
              {error ? 'Degraded' : 'Operational'}
            </div>
            <span className="metric-trend">{error ? 'API Offline' : 'Connected to API'}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          <Link to="/students" className="action-card">
            <span className="action-card-icon">📋</span>
            <div className="action-card-text">
              <h4>Student Directory</h4>
              <p>Search, filter, and review student details</p>
            </div>
          </Link>

          {isAdmin && (
            <Link to="/students/new" className="action-card">
              <span className="action-card-icon">➕</span>
              <div className="action-card-text">
                <h4>Enroll New Student</h4>
                <p>Register a student record into the system</p>
              </div>
            </Link>
          )}

          <Link to="/profile" className="action-card">
            <span className="action-card-icon">👤</span>
            <div className="action-card-text">
              <h4>Account Profile</h4>
              <p>View your credentials and security status</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h3 className="section-title">Recent Students</h3>
          <Link to="/students" className="recent-view-all">
            View All Students &rarr;
          </Link>
        </div>

        {loading && (
          <div className="recent-loading-state">
            <div className="recent-spinner" />
            <p>Fetching recently registered students...</p>
          </div>
        )}

        {!loading && error && (
          <div className="recent-error-state">
            <p>Could not load recent students from server: {error}</p>
          </div>
        )}

        {!loading && !error && recentStudents.length === 0 && (
          <div className="recent-empty-state">
            <p>No student records found in database.</p>
            {isAdmin && (
              <Link to="/students/new" className="btn-empty-enroll">
                Enroll First Student
              </Link>
            )}
          </div>
        )}

        {!loading && !error && recentStudents.length > 0 && (
          <div className="recent-table-wrapper">
            <table className="recent-table" aria-label="Recently added students">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Course</th>
                  <th scope="col">Roll Number</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s._id || s.studentId}>
                    <td><code>{s.studentId}</code></td>
                    <td className="recent-name">{s.fullName}</td>
                    <td>
                      <span className="badge-recent-course">{s.course}</span>
                    </td>
                    <td>{s.rollNo}</td>
                    <td>
                      <Link to={`/students/${s._id}/edit`} className="recent-link">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
