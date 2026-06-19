const { body } = require('express-validator');

const checkoutValidation = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.email').trim().isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').optional().trim(),
];

const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = { checkoutValidation, addToCartValidation };
