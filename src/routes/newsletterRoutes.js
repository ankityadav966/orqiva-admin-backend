import express from 'express';
import {
  getSubscribers,
  deleteSubscriber,
  exportNewsletterCSV,
} from '../controllers/newsletterController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSubscribers);
router.get('/export/csv', exportNewsletterCSV);
router.delete('/:id', deleteSubscriber);

export default router;
