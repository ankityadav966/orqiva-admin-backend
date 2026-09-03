import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { projectValidator } from '../validators/index.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', projectValidator, validate, createProject);
router.put('/:id', projectValidator, validate, updateProject);
router.delete('/:id', deleteProject);

export default router;
