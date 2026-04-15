import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';

// Helper to normalized completed problems
const normalizeCP = (cp) => {
  let completed = {};
  if (!cp) completed = {};
  else if (cp instanceof Map) completed = Object.fromEntries(cp);
  else if (typeof cp === 'object') completed = cp;
  else {
    try { completed = JSON.parse(cp); } catch (e) { completed = {}; }
  }
  return completed;
}

// 1. Check Username
export async function checkUsername(req, res) {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ available: false });
    const existing = await User.findOne({ username: username.toLowerCase() });
    res.json({ available: !existing });
  } catch (err) {
    res.status(500).json({ message: 'Error checking username', error: err.message });
  }
}

// 2. Register
export async function register(req, res) {
  try {
    const { name, email, password, username } = req.body;
    if (!username || !username.match(/^[a-z0-9_]{3,20}$/)) {
      return res.status(400).json({ message: 'Invalid username format' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });
    
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'Username is already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, username: username.toLowerCase(), password: hashed });
    
    // Auto-login after registration is common, but prompt requested separating auth logic. We'll return success to let UI handle.
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

// 3. Login (Username + Password)
export async function login(req, res) {
  try {
    const { identifier, password } = req.body; 
    const isEmail = identifier.includes('@');
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier.toLowerCase() }
    );
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, username: user.username, completedProblems: normalizeCP(user.completedProblems) } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

// Generates 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 4. Send Login OTP
export async function sendLoginOtp(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If this email exists, an OTP was sent.' }); // Enumeration protection
    
    // Check cooldown (e.g. 1 minute)
    if (user.loginOtpExpiry && user.loginOtpExpiry > new Date() && (user.loginOtpExpiry.getTime() - new Date().getTime() > 9 * 60 * 1000)) {
        return res.status(429).json({ message: 'Please wait before requesting another OTP.' });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp, 'login');
    res.json({ message: 'If this email exists, an OTP was sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
}

// 5. Verify Login OTP
export async function verifyLoginOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.loginOtp || !user.loginOtpExpiry) return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (new Date() > user.loginOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const match = await bcrypt.compare(otp, user.loginOtp);
    if (!match) return res.status(400).json({ message: 'Invalid OTP' });

    // Clear OTP fields
    user.loginOtp = undefined;
    user.loginOtpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, username: user.username, completedProblems: normalizeCP(user.completedProblems) } });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
}

// 6. Forgot Password (Send Reset OTP)
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If this email exists, an OTP was sent.' });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
    await user.save();

    await sendOtpEmail(user.email, otp, 'reset');
    res.json({ message: 'If this email exists, an OTP was sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request reset', error: err.message });
  }
}

// 7. Reset Password (Verify OTP & Set New Password)
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) return res.status(400).json({ message: 'Invalid or expired reset request' });

    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const match = await bcrypt.compare(otp, user.resetOtp);
    if (!match) return res.status(400).json({ message: 'Invalid OTP' });

    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed', error: err.message });
  }
}

// Keeping legacy google auth for compatibility if needed
export async function googleAuth(req, res) {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    let user = await User.findOne({ email });
    if (!user) {
        // Auto-generate a username for OAuth to maintain DB constraints
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
        let newUsername = baseUsername;
        let counter = 1;
        while(await User.findOne({username: newUsername})) {
          newUsername = `${baseUsername}_${counter++}`;
        }
    
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashed = await bcrypt.hash(randomPassword, 10);
        user = await User.create({ name, email, username: newUsername, password: hashed });
    }
    
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, username: user.username, completedProblems: normalizeCP(user.completedProblems) } });
  } catch (err) {
    res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
}
