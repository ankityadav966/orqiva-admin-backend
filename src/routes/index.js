import express from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import industryRoutes from './industryRoutes.js';
import projectRoutes from './projectRoutes.js';
import technologyRoutes from './technologyRoutes.js';
import clientRoutes from './clientRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import blogRoutes from './blogRoutes.js';
import faqRoutes from './faqRoutes.js';
import careerRoutes from './careerRoutes.js';
import leadRoutes from './leadRoutes.js';
import contactRoutes from './contactRoutes.js';
import newsletterRoutes from './newsletterRoutes.js';
import heroRoutes from './heroRoutes.js';
import statRoutes from './statRoutes.js';
import featuredProjectRoutes from './featuredProjectRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import navigationRoutes from './navigationRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import publicRoutes from './publicRoutes.js';
import meetingRoutes from './meetingRoutes.js';

import mongoose from 'mongoose';

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    success: isConnected,
    message: isConnected ? 'API is healthy' : 'Database not connected',
    database: isConnected ? 'connected' : 'disconnected',
  });
});

router.use('/auth', authRoutes);

router.use('/dashboard', dashboardRoutes);
router.use('/services', serviceRoutes);
router.use('/industries', industryRoutes);
router.use('/projects', projectRoutes);
router.use('/technologies', technologyRoutes);
router.use('/clients', clientRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/blog', blogRoutes);
router.use('/faqs', faqRoutes);
router.use('/careers', careerRoutes);
router.use('/leads', leadRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/hero', heroRoutes);
router.use('/statistics', statRoutes);
router.use('/featured-project', featuredProjectRoutes);
router.use('/settings', settingsRoutes);
router.use('/navigation', navigationRoutes);
router.use('/media', mediaRoutes);
router.use('/public', publicRoutes);
router.use('/meetings', meetingRoutes);

export default router;
