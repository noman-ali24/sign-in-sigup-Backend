const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const signinService = require('../services/signin.service');

/**
 * @desc   Authenticate user and return JWT
 * @route  POST /api/auth/signin
 * @access Public
 */
const signinController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await signinService({ email, password });

  return ApiResponse.success(
    res,
    {
      token: result.token,
      user: result.user,
    },
    'Signed in successfully'
  );
});

module.exports = signinController;
