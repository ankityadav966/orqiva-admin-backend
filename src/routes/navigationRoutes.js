import express from 'express';
import {
  getNavItems,
  createNavItem,
  updateNavItem,
  deleteNavItem,
} from '../controllers/navigationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getNavItems);
router.post('/', createNavItem);
router.put('/:id', updateNavItem);
router.delete('/:id', deleteNavItem);

export default router;
