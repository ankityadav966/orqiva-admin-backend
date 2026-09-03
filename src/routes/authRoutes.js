import express from 'express';
import { login, logout, getMe, updateProfile, changePassword, sendOtp, verifyOtp } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { loginValidator, updateProfileValidator, changePasswordValidator } from '../validators/authValidator.js';

const router = express.Router();

router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfileValidator, validate, updateProfile);
router.put('/change-password', authMiddleware, changePasswordValidator, validate, changePassword);

export default router;
