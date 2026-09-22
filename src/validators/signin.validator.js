/**
 * Validator for User Signin
 */
const validateSignin = (data) => {
  const errors = [];
  const email = (data.email || '').trim();
  const password = data.password || '';

  if (!email) {
    errors.push({ field: 'email', message: 'Please enter your email address' });
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Please enter your password' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = validateSignin;
