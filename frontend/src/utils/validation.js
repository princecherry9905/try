export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateStudentForm(formData) {
  const errors = {};

  if (!formData.studentId || !formData.studentId.trim()) {
    errors.studentId = 'Student ID is required (e.g. STU-1001).';
  } else if (formData.studentId.trim().length < 3) {
    errors.studentId = 'Student ID must be at least 3 characters.';
  }

  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please provide a valid email address format.';
  }

  if (!formData.course || !formData.course.trim()) {
    errors.course = 'Academic Course / Branch is required.';
  }

  if (!formData.rollNo || !formData.rollNo.trim()) {
    errors.rollNo = 'Roll Number is required.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function validateAuthForm({ email, password, isRegister = false, name = '', confirmPassword = '' }) {
  const errors = {};

  if (isRegister) {
    if (!name || !name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please provide a valid email format.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (isRegister && confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
