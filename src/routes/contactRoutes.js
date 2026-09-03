import express from 'express';
import {
  getContactSubmissions,
  updateContactStatus,
  deleteContactSubmission,
} from '../controllers/contactController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getContactSubmissions);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContactSubmission);

export default router;
