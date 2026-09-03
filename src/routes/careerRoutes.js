import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/careerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

router.get('/applications', getApplications);
router.put('/applications/:id/status', updateApplicationStatus);
router.delete('/applications/:id', deleteApplication);

export default router;
