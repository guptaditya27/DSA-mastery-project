
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import mindmapRoutes from './routes/mindmap.js';
import patternRoutes from './routes/pattern.js';
import statsRoutes from './routes/stats.js';
import userRoutes from './routes/user.js';
import Problem from './models/Problem.js';

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint for MongoDB connectivity
app.get('/api/test', async (req, res) => {
  try {
    const count = await Problem.countDocuments();
    res.json({ message: 'MongoDB connected successfully', problemCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/mindmap', mindmapRoutes);
app.use('/api/pattern', patternRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

export default app;
