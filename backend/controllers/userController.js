import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, email, password } = req.body;
    const update = { name, email };
    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
}
