const HTTP_STATUS = require('../constants/httpStatus');

/**
 * Standardized API Response formatter
 */
class ApiResponse {
  static success(res, data = {}, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      ...data,
    });
  }

  static created(res, data = {}, message = 'Created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }
}

module.exports = ApiResponse;
