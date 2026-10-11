import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../components/DeleteModal';
import './StudentList.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://xstudent.onrender.com/api';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const url = `${BASE_URL.replace(/\/+$/, '')}/students`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch students (Status ${res.status})`);
        }

        const data = await res.json();
        if (!ignore) {
          setStudents(Array.isArray(data.students) ? data.students : []);
          setTotalStudents(data.totalStudents || (Array.isArray(data.students) ? data.students.length : 0));
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Error connecting to student service.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const url = `${BASE_URL.replace(/\/+$/, '')}/students`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    fetch(url, { headers })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to fetch students (Status ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setStudents(Array.isArray(data.students) ? data.students : []);
        setTotalStudents(data.totalStudents || (Array.isArray(data.students) ? data.students.length : 0));
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Error connecting to student service.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const availableCourses = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.course && typeof s.course === 'string') {
        set.add(s.course.trim());
      }
    });
    return Array.from(set).sort();
  }, [students]);

  const availableSemesters = useMemo(() => {
    const set = new Set();
    students.forEach((s) => {
      if (s.semester !== undefined && s.semester !== null && s.semester !== '') {
        set.add(String(s.semester));
      }
    });
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (student.fullName && student.fullName.toLowerCase().includes(term)) ||
        (student.rollNo && String(student.rollNo).toLowerCase().includes(term)) ||
        (student.email && student.email.toLowerCase().includes(term)) ||
        (student.studentId && String(student.studentId).toLowerCase().includes(term));

      const matchesCourse =
        selectedCourse === 'ALL' ||
        (student.course && student.course.trim().toLowerCase() === selectedCourse.toLowerCase());

      const matchesSemester =
        selectedSemester === 'ALL' ||
        String(student.semester) === String(selectedSemester);

      return matchesSearch && matchesCourse && matchesSemester;
    });
  }, [students, searchTerm, selectedCourse, selectedSemester]);

  const hasActiveFilters = searchTerm !== '' || selectedCourse !== 'ALL' || selectedSemester !== 'ALL';

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('ALL');
    setSelectedSemester('ALL');
  };

  const handleRequestDelete = (student) => {
    setStudentToDelete(student);
  };

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setStudentToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setDeleteLoading(true);
    const targetId = studentToDelete._id || studentToDelete.studentId;
    const targetName = studentToDelete.fullName;

    try {
      const url = `${BASE_URL.replace(/\/+$/, '')}/students/${targetId}`;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server returned error status ${res.status}`);
      }

      setStudents((prev) => prev.filter((s) => (s._id || s.studentId) !== targetId));
      setTotalStudents((prev) => Math.max(0, prev - 1));
      setStudentToDelete(null);
      setNotification({
        type: 'success',
        message: `Student record for "${targetName}" was permanently deleted.`,
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Failed to delete "${targetName}": ${err.message}`,
      });
      setStudentToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="student-list-container">
      {notification && (
        <div
          className={`notification-banner notification-${notification.type}`}
          role="alert"
        >
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            className="btn-close-notification"
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      <div className="student-list-header">
        <div>
          <h1 className="student-list-title">Student Directory</h1>
          <p className="student-list-subtitle">
            Manage enrolled students, academic courses, and record details.
          </p>
        </div>
        <Link to="/students/new" className="btn-add-student">
          + Add New Student
        </Link>
      </div>

      {!loading && !error && students.length > 0 && (
        <div className="filter-toolbar" aria-label="Student search and filter bar">
          <div className="search-input-group">
            <span className="search-icon" aria-hidden="true">&#128269;</span>
            <input
              type="text"
              id="student-search-input"
              className="filter-search-input"
              placeholder="Search by name, roll number, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search students by name, roll number, or email"
            />
            {searchTerm && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search text"
              >
                &times;
              </button>
            )}
          </div>

          <div className="filter-select-group">
            <label htmlFor="course-filter-select" className="filter-label">Course:</label>
            <select
              id="course-filter-select"
              className="filter-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              aria-label="Filter by academic course"
            >
              <option value="ALL">All Courses</option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {availableSemesters.length > 0 && (
            <div className="filter-select-group">
              <label htmlFor="semester-filter-select" className="filter-label">Semester:</label>
              <select
                id="semester-filter-select"
                className="filter-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                aria-label="Filter by semester"
              >
                <option value="ALL">All Semesters</option>
                {availableSemesters.map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-clear-all-filters"
              onClick={handleClearFilters}
              aria-label="Clear all applied filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="state-card state-loading" role="status">
          <div className="spinner" />
          <p>Loading student records from server...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-card state-error" role="alert">
          <p className="error-text"><strong>API Error:</strong> {error}</p>
          <button type="button" className="btn-retry" onClick={handleRetry}>
            Retry Request
          </button>
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <div className="state-card state-empty">
          <h3>No Student Records Found</h3>
          <p>The student directory is currently empty.</p>
          <Link to="/students/new" className="btn-add-first">
            Enroll First Student
          </Link>
        </div>
      )}

      {!loading && !error && students.length > 0 && filteredStudents.length === 0 && (
        <div className="state-card state-empty">
          <h3>No Matching Students</h3>
          <p>No student records matched your search or filter criteria.</p>
          <button type="button" className="btn-retry" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {!loading && !error && filteredStudents.length > 0 && (
        <div className="table-responsive-wrapper">
          <div className="table-meta-bar">
            <span>
              Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
              {totalStudents > students.length && ` (total ${totalStudents} in directory)`}
            </span>
          </div>

          <table className="student-table" aria-label="Student records list">
            <thead>
              <tr>
                <th scope="col">Student ID</th>
                <th scope="col">Full Name</th>
                <th scope="col">Email</th>
                <th scope="col">Course</th>
                <th scope="col">Roll Number</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id || student.studentId}>
                  <td className="cell-id">
                    <code>{student.studentId}</code>
                  </td>
                  <td className="cell-name">{student.fullName}</td>
                  <td className="cell-email">{student.email}</td>
                  <td className="cell-course">
                    <span className="badge-course">{student.course}</span>
                  </td>
                  <td className="cell-roll">{student.rollNo}</td>
                  <td className="cell-actions">
                    <div className="actions-cell-group">
                      <Link to={`/students/${student._id}/edit`} className="action-link edit-link">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="action-btn-delete"
                        onClick={() => handleRequestDelete(student)}
                        aria-label={`Delete record for ${student.fullName}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={Boolean(studentToDelete)}
        title="Confirm Student Deletion"
        message="Are you sure you want to delete this student record? This action will permanently remove the student from the database."
        itemName={studentToDelete ? `${studentToDelete.fullName} (${studentToDelete.studentId || studentToDelete.rollNo})` : ''}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
