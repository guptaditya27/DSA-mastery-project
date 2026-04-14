import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Normalize completedProblems to a plain object before sending to frontend
    const cp = user.completedProblems;
    let completed = {};
    if (!cp) completed = {};
    else if (cp instanceof Map) completed = Object.fromEntries(cp);
    else if (typeof cp === 'object') completed = cp;
    else {
      try { completed = JSON.parse(cp); } catch (e) { completed = {}; }
    }

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, completedProblems: completed } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}
