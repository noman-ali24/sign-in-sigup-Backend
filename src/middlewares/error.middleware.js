const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error('API Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: error.statusCode,
    });
  }

  // Mongoose duplicate key error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `An account with this ${field} already exists.`;
    error.statusCode = HTTP_STATUS.CONFLICT;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    error.statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please authenticate again.';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired. Please log in again.';
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message || 'Internal Server Error',
    errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
