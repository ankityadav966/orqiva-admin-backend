import express from 'express';
import {
  requestMeeting,
  getAllMeetings,
  getMeetingById,
  startMeeting,
  endMeeting,
} from '../controllers/meetingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: Request Google Meeting
router.post('/request', requestMeeting);

// Protected: Admin meeting management
router.get('/', authMiddleware, getAllMeetings);
router.get('/:id', authMiddleware, getMeetingById);
router.patch('/:id/start', authMiddleware, startMeeting);
router.patch('/:id/end', authMiddleware, endMeeting);

export default router;
