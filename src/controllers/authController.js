import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { ENV } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateToken = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    return ApiResponse.error(res, {
      statusCode: 401,
      message: 'Invalid email or password credentials.',
    });
  }

  if (!admin.isActive) {
    return ApiResponse.error(res, {
      statusCode: 403,
      message: 'Your administrator account has been disabled.',
    });
  }

  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = generateToken(admin._id);

  const adminData = {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar,
    lastLogin: admin.lastLogin,
  };

  return ApiResponse.success(res, {
    message: 'Login successful.',
    data: {
      admin: adminData,
      token,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {
    message: 'Logout successful.',
    data: null,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const admin = req.admin;
  return ApiResponse.success(res, {
    message: 'Profile retrieved.',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body;
  const admin = req.admin;

  if (email && email !== admin.email) {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return ApiResponse.error(res, {
        statusCode: 409,
        message: 'This email address is already in use.',
      });
    }
    admin.email = email;
  }

  if (name) admin.name = name;
  if (avatar !== undefined) admin.avatar = avatar;

  await admin.save();

  return ApiResponse.success(res, {
    message: 'Profile updated successfully.',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!(await admin.comparePassword(currentPassword))) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Current password does not match.',
    });
  }

  admin.password = newPassword;
  await admin.save();

  return ApiResponse.success(res, {
    message: 'Password changed successfully.',
    data: null,
  });
});
