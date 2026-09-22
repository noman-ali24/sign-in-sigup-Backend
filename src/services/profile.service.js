const User = require('../models/User');
const connectDB = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Service: Fetch user profile by ID
 */
const profileService = async (userId) => {
  await connectDB();

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw ApiError.notFound('User profile not found.');
  }

  return {
    user: user.toSafeObject(),
  };
};

module.exports = profileService;
