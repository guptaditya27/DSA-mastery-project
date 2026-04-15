import express from 'express';
import { 
  register, 
  login, 
  googleAuth, 
  checkUsername, 
  sendLoginOtp, 
  verifyLoginOtp, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/check-username', checkUsername);
router.post('/register', register);
router.post('/login', login);

router.post('/login/otp/send', sendLoginOtp);
router.post('/login/otp/verify', verifyLoginOtp);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/google', googleAuth);

export default router;
