import express from 'express';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', getMedia);
router.delete('/:id', deleteMedia);

export default router;
