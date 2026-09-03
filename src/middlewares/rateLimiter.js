import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      statusCode: 429,
      message: 'Too many requests from this IP address. Please try again after 15 minutes.',
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit login attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, {
      statusCode: 429,
      message: 'Too many login attempts. Please try again after 15 minutes.',
    });
  },
});
