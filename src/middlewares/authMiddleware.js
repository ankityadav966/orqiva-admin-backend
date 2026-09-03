import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return ApiResponse.error(res, {
        statusCode: 401,
        message: 'Authentication token is required. Please login.',
      });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return ApiResponse.error(res, {
        statusCode: 401,
        message: 'Invalid session or administrator account is deactivated.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return ApiResponse.error(res, {
      statusCode: 401,
      message: 'Invalid or expired token. Please login again.',
    });
  }
};

export const adminMiddleware = (roles = ['super_admin', 'admin']) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return ApiResponse.error(res, {
        statusCode: 403,
        message: 'Access denied: Insufficient permissions for this action.',
      });
    }
    next();
  };
};
