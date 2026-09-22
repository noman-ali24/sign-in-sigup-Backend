const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Sign JWT Helper
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'autopulse_super_secret_jwt_key_2026_change_me';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id: userId }, secret, { expiresIn });
};

/**
 * Service: Authenticate user & issue JWT
 */
const signinService = async ({ email, password }) => {
  const userEmail = (email || '').trim().toLowerCase();

  // Connect to Database
  await connectDB();

  // Find user by email
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Check password match
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Generate JWT token
  const token = generateToken(user._id);

  return {
    user: user.toSafeObject(),
    token,
  };
};

module.exports = signinService;
