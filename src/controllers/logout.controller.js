const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc   Logout current user
 * @route  POST /api/auth/logout
 * @access Private
 */
const logoutController = asyncHandler(async (req, res) => {
  const userEmail = req.user ? req.user.email : 'Unknown';
  const userId = req.user ? (req.user._id || req.user.id) : 'Unknown';

  console.log(`👋 [LOGOUT] User logged out: ${userEmail} (ID: ${userId})`);

  return ApiResponse.success(
    res,
    null,
    'Logged out successfully'
  );
});

module.exports = logoutController;
