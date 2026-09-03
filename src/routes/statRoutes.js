import express from 'express';
import {
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from '../controllers/statController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getStatistics);
router.post('/', createStatistic);
router.put('/:id', updateStatistic);
router.delete('/:id', deleteStatistic);

export default router;
