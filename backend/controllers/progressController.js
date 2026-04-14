

import User from '../models/User.js';

// @desc    Get the logged-in user's progress
// @route   GET /api/progress
export const getProgress = async (req, res) => {
  try {
    console.log('Getting progress for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert Map to plain object for frontend and restore original keys
    let completedProblems = {};
    if (user.completedProblems instanceof Map) {
      user.completedProblems.forEach((value, key) => {
        // Replace underscores back with dots for frontend
        const originalKey = key.replace(/_/g, '.');
        completedProblems[originalKey] = value;
      });
    } else if (typeof user.completedProblems === 'object') {
      Object.entries(user.completedProblems).forEach(([key, value]) => {
        const originalKey = key.replace(/_/g, '.');
        completedProblems[originalKey] = value;
      });
    }

    console.log('Sending progress:', completedProblems);
    res.status(200).json({ completedProblems });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

// @desc    Update the logged-in user's progress
// @route   PUT /api/progress
export const updateProgress = async (req, res) => {
  try {
    console.log('Updating progress for user:', req.user.id);
    console.log('New progress data:', req.body.completedProblems);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's progress with sanitized keys
    if (req.body.completedProblems && typeof req.body.completedProblems === 'object') {
      const sanitizedEntries = Object.entries(req.body.completedProblems).map(([key, value]) => {
        // Replace dots with a safe character (underscore)
        const safeKey = key.replace(/\./g, '_');
        return [safeKey, value];
      });
      user.completedProblems = new Map(sanitizedEntries);
    }

    await user.save();
    
    // Convert Map back to object for frontend, restoring original keys
    const completedProblems = {};
    user.completedProblems.forEach((value, key) => {
      // Replace underscores back with dots for frontend
      const originalKey = key.replace(/_/g, '.');
      completedProblems[originalKey] = value;
    });
    
    console.log('Updated progress:', completedProblems);
    res.status(200).json({ completedProblems });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
};