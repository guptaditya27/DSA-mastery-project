import mongoose from 'mongoose';

const mindmapNodeSchema = new mongoose.Schema({
  // UI-level id used by frontend (matches edges.from / edges.to)
  id: { type: String },
  // position & sizing for visual layout
  x: { type: Number },
  y: { type: Number },
  w: { type: Number },
  label: { type: String, required: true },
  description: { type: String },
  pattern: { type: String },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'MindmapNode' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MindmapNode' }],
  order: { type: Number },
  h: { type: Number, required: true },
  examples: [String],
  level: { type: Number, required: true },
  color: { type: String, required: true },
  timeComplexity: String,
  spaceComplexity: String,
  keyInsight: String,
}, { timestamps: true });

const MindmapNode = mongoose.model('MindmapNode', mindmapNodeSchema);

export default MindmapNode;
