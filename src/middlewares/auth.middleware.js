const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Protect route middleware - verifies JWT Bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(ApiError.unauthorized('Access denied. No authorization token provided.'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'autopulse_super_secret_jwt_key_2026_change_me';
    const decoded = jwt.verify(token, secret);

    await connectDB();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(ApiError.unauthorized('The user belonging to this token no longer exists.'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(ApiError.unauthorized('Invalid or expired token. Please sign in again.'));
  }
};

module.exports = { protect };
