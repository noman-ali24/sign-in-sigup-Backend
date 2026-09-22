const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');

/**
 * Generate a signed JWT
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'autopulse_super_secret_jwt_key_2026_change_me';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

/**
 * @desc   Register a new user (Sign Up)
 * @route  POST /api/auth/signup
 * @access Public
 */
const signup = async (req, res) => {
  try {
    const { fullName, name, email, phoneNumber, phone, password, termsAccepted } = req.body;

    // Support both AutoPulse field names and standard field names
    const userName = (fullName || name || '').trim();
    const userEmail = (email || '').trim().toLowerCase();
    const userPhone = (phoneNumber || phone || '').trim();

    // Input Validation
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name.',
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.',
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in instead.',
      });
    }

    // Create user
    const user = await User.create({
      name: userName,
      email: userEmail,
      phone: userPhone,
      password,
      termsAccepted: termsAccepted !== undefined ? Boolean(termsAccepted) : true,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during sign up.',
      error: error.message,
    });
  }
};

/**
 * @desc   Authenticate user & return JWT token (Sign In)
 * @route  POST /api/auth/signin
 * @access Public
 */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userEmail = (email || '').trim().toLowerCase();

    // Input Validation
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during sign in.',
      error: error.message,
    });
  }
};

/**
 * @desc   Get current authenticated user profile
 * @route  GET /api/auth/profile
 * @access Private
 */
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile.',
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  signin,
  getProfile,
};
