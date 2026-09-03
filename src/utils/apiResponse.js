/**
 * Standardized API response structure
 */
export class ApiResponse {
  static success(res, { data = null, message = 'Success', pagination = null, statusCode = 200 }) {
    const responsePayload = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      responsePayload.pagination = pagination;
    }

    return res.status(statusCode).json(responsePayload);
  }

  static error(res, { message = 'Internal Server Error', errors = null, statusCode = 500 }) {
    const responsePayload = {
      success: false,
      message,
    };

    if (errors) {
      responsePayload.errors = errors;
    }

    return res.status(statusCode).json(responsePayload);
  }
}
