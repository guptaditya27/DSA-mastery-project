import express from 'express';
import { createNode, updateNode, deleteNode, getProblems, createProblem, updateProblem, deleteProblem ,getMindmapData} from '../controllers/mindmapController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authMiddleware, getMindmapData);

router.post('/node', authMiddleware, createNode);
router.put('/node/:id', authMiddleware, updateNode);
router.delete('/node/:id', authMiddleware, deleteNode);

router.get('/problems', authMiddleware, getProblems);
router.post('/problem', authMiddleware, createProblem);
router.put('/problem/:id', authMiddleware, updateProblem);
router.delete('/problem/:id', authMiddleware, deleteProblem);
router.get('/data', authMiddleware, getMindmapData);
export default router;
