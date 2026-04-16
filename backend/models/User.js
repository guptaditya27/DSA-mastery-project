import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9_]{3,20}$/, 'Username must be 3-20 characters long and can only contain lowercase letters, numbers, and underscores']
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Profile Fields
  profilePhoto: { type: String, default: '' },  // base64 data URL
  college: { type: String, default: '' },
  graduationYear: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 200 },
  
  // Optional Profile Fields
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  leetcodeUsername: { type: String, default: '' },
  preferredLanguage: { type: String, default: '', enum: ['', 'C++', 'Java', 'Python', 'JavaScript', 'Go', 'Rust', 'TypeScript'] },

  // OTP Fields
  loginOtp: { type: String },
  loginOtpExpiry: { type: Date },
  resetOtp: { type: String },
  resetOtpExpiry: { type: Date },
  
  completedProblems: {
    type: Map,
    of: Boolean,
    default: new Map(),
    validate: {
      validator: function(map) {
        if (!(map instanceof Map)) return false;
        // Check that all keys are strings and values are booleans
        for (const [key, value] of map) {
          if (typeof key !== 'string' || typeof value !== 'boolean') {
            return false;
          }
        }
        return true;
      },
      message: 'Invalid completedProblems map'
    }
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
