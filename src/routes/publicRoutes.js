import express from 'express';
import {
  getPublicHome,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicIndustries,
  getPublicIndustryBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicTechnologies,
  getPublicTestimonials,
  getPublicBlog,
  getPublicBlogPostBySlug,
  getPublicFAQs,
  getPublicJobs,
  getPublicSettings,
  submitPublicLead,
  submitPublicContact,
  submitPublicNewsletter,
  submitJobApplication,
  uploadPublicFile,
} from '../controllers/publicController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { leadValidator, contactValidator } from '../validators/index.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Aggregate Home
router.get('/home', getPublicHome);
router.get('/homepage', getPublicHome);
router.get('/all', getPublicHome);


// Content endpoints
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);

router.get('/industries', getPublicIndustries);
router.get('/industries/:slug', getPublicIndustryBySlug);

router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

router.get('/technologies', getPublicTechnologies);
router.get('/testimonials', getPublicTestimonials);

router.get('/blog', getPublicBlog);
router.get('/blog/:slug', getPublicBlogPostBySlug);

router.get('/faqs', getPublicFAQs);
router.get('/jobs', getPublicJobs);
router.get('/careers', getPublicJobs);
router.get('/settings', getPublicSettings);

// Public submissions & uploads
router.post('/upload', upload.single('file'), uploadPublicFile);
router.post('/careers/upload-resume', upload.single('resume'), uploadPublicFile);
router.post('/leads', leadValidator, validate, submitPublicLead);
router.post('/contact', contactValidator, validate, submitPublicContact);
router.post('/newsletter', submitPublicNewsletter);
router.post('/jobs/apply', submitJobApplication);
router.post('/careers/apply', submitJobApplication);

export default router;
