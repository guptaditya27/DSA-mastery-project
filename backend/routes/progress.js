import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getProgress);
router.put('/', authMiddleware, updateProgress);

export default router;
