import express from 'express';
import {
  getIndustries,
  getIndustryById,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from '../controllers/industryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { industryValidator } from '../validators/index.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getIndustries);
router.get('/:id', getIndustryById);
router.post('/', industryValidator, validate, createIndustry);
router.put('/:id', industryValidator, validate, updateIndustry);
router.delete('/:id', deleteIndustry);

export default router;
