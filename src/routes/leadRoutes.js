import express from 'express';
import {
  getLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);
router.put('/:id/status', updateLeadStatus);
router.post('/:id/notes', addLeadNote);
router.delete('/:id', deleteLead);

export default router;
