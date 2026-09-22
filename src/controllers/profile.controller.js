const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const profileService = require('../services/profile.service');

/**
 * @desc   Get current user profile
 * @route  GET /api/auth/profile
 * @access Private
 */
const profileController = asyncHandler(async (req, res) => {
  const result = await profileService(req.user._id || req.user.id);

  return ApiResponse.success(
    res,
    {
      user: result.user,
    },
    'Profile retrieved successfully'
  );
});

module.exports = profileController;
