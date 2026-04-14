import Pattern from '../models/Pattern.js';
import MindmapNode from '../models/MindmapNode.js';
import Problem from '../models/Problem.js';

export async function getPatterns(req, res) {
  try {
    const patterns = await Pattern.find().populate('nodes problems');
    res.json(patterns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get patterns', error: err.message });
  }
}

export async function createPattern(req, res) {
  try {
    const pattern = await Pattern.create(req.body);
    res.status(201).json(pattern);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create pattern', error: err.message });
  }
}

export async function updatePattern(req, res) {
  try {
    const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pattern);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update pattern', error: err.message });
  }
}

export async function deletePattern(req, res) {
  try {
    await Pattern.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pattern deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete pattern', error: err.message });
  }
}
