const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const signupService = require('../services/signup.service');

/**
 * @desc   Register a new user
 * @route  POST /api/auth/signup
 * @access Public
 */
const signupController = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const name = req.body.fullName || req.body.name;
  console.log(`📝 [SIGNUP] Attempting signup for name: "${name}", email: "${email}"`);

  const result = await signupService(req.body);

  console.log(`🎉 [SIGNUP SUCCESS] New user registered: ${result.user.email} (ID: ${result.user.id})`);

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
