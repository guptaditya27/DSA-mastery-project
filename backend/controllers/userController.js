import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Mandatory fields that count toward profile completion
const MANDATORY_FIELDS = ['name', 'username', 'email', 'profilePhoto', 'college', 'graduationYear', 'bio'];

function calculateProfileCompletion(user) {
  let filled = 0;
  for (const field of MANDATORY_FIELDS) {
    if (user[field] && String(user[field]).trim().length > 0) {
      filled++;
    }
  }
  return Math.round((filled / MANDATORY_FIELDS.length) * 100);
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password -loginOtp -loginOtpExpiry -resetOtp -resetOtpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userObj = user.toObject();
    userObj.profileCompletion = calculateProfileCompletion(userObj);
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const allowedFields = [
      'name', 'profilePhoto', 'college', 'graduationYear', 'bio',
      'phone', 'city', 'linkedinUrl', 'githubUrl', 'leetcodeUsername', 'preferredLanguage'
    ];
    
    const update = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    // Handle password change separately
    if (req.body.password && req.body.password.length >= 6) {
      update.password = await bcrypt.hash(req.body.password, 10);
    }

    // Validate profile photo size (max ~300KB base64)
    if (update.profilePhoto && update.profilePhoto.length > 400000) {
      return res.status(400).json({ message: 'Profile photo too large. Please use an image under 300KB.' });
    }

    // Validate bio length
    if (update.bio && update.bio.length > 200) {
      return res.status(400).json({ message: 'Bio must be 200 characters or less.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      update, 
      { new: true, runValidators: true }
    ).select('-password -loginOtp -loginOtpExpiry -resetOtp -resetOtpExpiry');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userObj = updatedUser.toObject();
    userObj.profileCompletion = calculateProfileCompletion(userObj);
    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
}
