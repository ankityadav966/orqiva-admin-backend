import express from 'express';
import { getHeroSection, updateHeroSection } from '../controllers/heroController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getHeroSection);
router.put('/', updateHeroSection);

export default router;
