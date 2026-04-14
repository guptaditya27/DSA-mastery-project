import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
});

const User = mongoose.model('User', userSchema);

export default User;
