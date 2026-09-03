import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { serviceValidator } from '../validators/index.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', serviceValidator, validate, createService);
router.put('/:id', serviceValidator, validate, updateService);
router.delete('/:id', deleteService);

export default router;
