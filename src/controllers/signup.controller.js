const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const signupService = require('../services/signup.service');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/signup
 * @access Public
 */
const signupController = asyncHandler(async (req, res) => {
  const result = await signupService(req.body);

  return ApiResponse.created(
    res,
    {
      token: result.token,
      user: result.user,
    },
    'User registered successfully'
  );
});

module.exports = signupController;
