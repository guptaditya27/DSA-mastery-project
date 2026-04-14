import mongoose from 'mongoose';

const patternSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MindmapNode' }],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
}, { timestamps: true });

export default mongoose.model('Pattern', patternSchema);
