import mongoose from 'mongoose';

const edgeSchema = mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const Edge = mongoose.model('Edge', edgeSchema);
export default Edge;