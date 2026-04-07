import express from 'express';

import {
  registerUser, 
  verifyOTP, 
  loginUser, 
  getProfile, 
  getAllUsers, 
  resendOTP, 
  updatePassword, 
  googleLogin,
  updatePreference
} from '../controllers/user.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/verify-otp', verifyOTP);

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getProfile);
router.put('/preference/:userId', updatePreference);
router.get('/getAllUsers', authMiddleware, getAllUsers);
router.post('/resend-otp', resendOTP);
router.post('/update-password', updatePassword);

// Google Login
router.post('/google-login', googleLogin);

export default router;
