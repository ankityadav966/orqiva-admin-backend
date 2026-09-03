import express from 'express';
import {
  getTechnologies,
  getTechnologyById,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from '../controllers/technologyController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTechnologies);
router.get('/:id', getTechnologyById);
router.post('/', createTechnology);
router.put('/:id', updateTechnology);
router.delete('/:id', deleteTechnology);

export default router;
