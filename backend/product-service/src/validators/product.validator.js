const { body, param } = require('express-validator');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('material').notEmpty().withMessage('Material is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('shape').notEmpty().withMessage('Shape is required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
  body('dimensions').trim().notEmpty().withMessage('Dimensions are required'),
  body('weight').trim().notEmpty().withMessage('Weight is required'),
  body('featured').optional().isBoolean(),
];

const reviewValidation = [
  param('productId').isMongoId().withMessage('Valid product ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 1000 }),
];

module.exports = { productValidation, reviewValidation };
