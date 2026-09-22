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
 * Service: Register new user
 */
const signupService = async (payload) => {
  const { fullName, name, email, phoneNumber, phone, password, termsAccepted } = payload;

  const userName = (fullName || name || '').trim();
  const userEmail = (email || '').trim().toLowerCase();
  const userPhone = (phoneNumber || phone || '').trim();

  // Connect to Database
  await connectDB();

  // Check if user already exists
  const existingUser = await User.findOne({ email: userEmail });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists. Please sign in instead.');
  }

  // Create new user record
  const user = await User.create({
    name: userName,
    email: userEmail,
    phone: userPhone,
    password,
    termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  return {
    user: user.toSafeObject(),
    token,
  };
};

module.exports = signupService;
