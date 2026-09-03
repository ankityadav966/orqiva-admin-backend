import { ApiResponse } from '../utils/apiResponse.js';
import { ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (ENV.NODE_ENV === 'development') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  return ApiResponse.error(res, {
    statusCode,
    message,
    errors,
  });
};

export const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, {
    statusCode: 404,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
};
