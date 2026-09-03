import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { ENV } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendAdminOtpEmail } from '../utils/emailService.js';

export const AUTHORIZED_ADMIN_EMAIL = 'ankityadav941318@gmail.com';

const generateToken = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Email address is required.',
    });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
    return ApiResponse.error(res, {
      statusCode: 403,
      message: `Access denied. Only the authorized administrator email (${AUTHORIZED_ADMIN_EMAIL}) is permitted to access this panel.`,
    });
  }

  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  let admin = await Admin.findOne({ email: normalizedEmail }).select('+loginOtp +loginOtpExpires');
  if (!admin) {
    admin = new Admin({
      name: 'Ankit Yadav',
      email: normalizedEmail,
      password: 'Admin@Orqiva2026!' + Math.random().toString(36).slice(2),
      role: 'super_admin',
      isActive: true,
      loginOtp: otp,
      loginOtpExpires: otpExpires,
    });
    await admin.save();
  } else {
    admin.loginOtp = otp;
    admin.loginOtpExpires = otpExpires;
    admin.isActive = true;
    await admin.save({ validateBeforeSave: false });
  }

  // Always log OTP to console (visible in Render logs as fallback)
  console.log(`[OTP] Admin login OTP for ${normalizedEmail}: ${otp} (expires in 10 min)`);

  try {
    await sendAdminOtpEmail(normalizedEmail, otp);
  } catch (emailErr) {
    console.error('[OTP Email Error]:', emailErr.message);
    // Don't fail — OTP is saved in DB, admin can check Render logs
    return ApiResponse.success(res, {
      message: `Verification code generated. Email delivery encountered an issue — please check your Render logs for the OTP code or try again.`,
      data: {
        email: normalizedEmail,
        expiresInMinutes: 10,
        emailDeliveryFailed: true,
      },
    });
  }

  return ApiResponse.success(res, {
    message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
    data: {
      email: normalizedEmail,
      expiresInMinutes: 10,
    },
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Email and 6-digit verification code are required.',
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const submittedOtp = otp.toString().trim();

  if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
    return ApiResponse.error(res, {
      statusCode: 403,
      message: 'Access denied. Unauthorized administrator email.',
    });
  }

  const admin = await Admin.findOne({ email: normalizedEmail }).select('+loginOtp +loginOtpExpires');

  if (!admin || !admin.loginOtp) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'No active verification code found. Please request a new code.',
    });
  }

  if (new Date() > new Date(admin.loginOtpExpires)) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Verification code has expired. Please request a new code.',
    });
  }

  if (admin.loginOtp !== submittedOtp) {
    return ApiResponse.error(res, {
      statusCode: 400,
      message: 'Invalid verification code. Please check your inbox and try again.',
    });
  }

  admin.loginOtp = undefined;
  admin.loginOtpExpires = undefined;
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
    message: 'OTP verification successful. Welcome back, Ankit!',
    data: {
      admin: adminData,
      token,
    },
  });
});

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
