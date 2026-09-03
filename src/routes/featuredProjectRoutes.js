import express from 'express';
import {
  getFeaturedProject,
  updateFeaturedProject,
} from '../controllers/featuredProjectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFeaturedProject);
router.put('/', updateFeaturedProject);

export default router;
