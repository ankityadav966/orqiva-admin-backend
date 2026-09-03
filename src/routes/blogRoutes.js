import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
} from '../controllers/blogController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { blogValidator } from '../validators/index.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getBlogPosts);
router.get('/categories', getBlogCategories);
router.post('/categories', createBlogCategory);
router.delete('/categories/:id', deleteBlogCategory);
router.get('/:id', getBlogPostById);
router.post('/', blogValidator, validate, createBlogPost);
router.put('/:id', blogValidator, validate, updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;
