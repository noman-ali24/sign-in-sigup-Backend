const ApiError = require('../utils/apiError');

/**
 * Higher-order middleware to run validator on request body
 */
const validate = (validatorFn) => (req, res, next) => {
  const { isValid, errors } = validatorFn(req.body);

  if (!isValid) {
    const firstMessage = errors[0]?.message || 'Validation failed';
    return next(ApiError.badRequest(firstMessage, errors));
  }

  next();
};

module.exports = validate;
