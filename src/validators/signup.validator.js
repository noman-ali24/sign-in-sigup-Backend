/**
 * Validator for User Signup
 */
const validateSignup = (data) => {
  const errors = [];
  const name = (data.fullName || data.name || '').trim();
  const email = (data.email || '').trim();
  const password = data.password || '';

  if (!name) {
    errors.push({ field: 'name', message: 'Please enter your full name' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Please enter your email address' });
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Please enter a password' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = validateSignup;
