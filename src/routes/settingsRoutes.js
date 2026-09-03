import express from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/settingsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSiteSettings);
router.put('/', updateSiteSettings);

export default router;
