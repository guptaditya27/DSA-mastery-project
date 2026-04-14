import express from 'express';
import { getPatterns, createPattern, updatePattern, deletePattern } from '../controllers/patternController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getPatterns);
router.post('/', authMiddleware, createPattern);
router.put('/:id', authMiddleware, updatePattern);
router.delete('/:id', authMiddleware, deletePattern);

export default router;
