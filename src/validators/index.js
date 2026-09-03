import { body } from 'express-validator';

export const serviceValidator = [
  body('title').trim().notEmpty().withMessage('Service title is required'),
  body('description').notEmpty().withMessage('Service description is required'),
  body('order').optional().isInt().withMessage('Order must be an integer'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
];

export const industryValidator = [
  body('name').trim().notEmpty().withMessage('Industry name is required'),
  body('projectCount').optional().trim().notEmpty().withMessage('Project count cannot be empty'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
];

export const projectValidator = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('category').trim().notEmpty().withMessage('Project category is required'),
  body('description').notEmpty().withMessage('Project description is required'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
];

export const leadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('source').optional().isIn(['Quote', 'Demo', 'Consultation', 'Contact Form', 'Other']),
];

export const blogValidator = [
  body('title').trim().notEmpty().withMessage('Blog title is required'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required'),
  body('content').notEmpty().withMessage('Blog content is required'),
  body('status').optional().isIn(['Draft', 'Published', 'Archived']),
];

export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required'),
];
