const router = require('express').Router();
const reviewController = require('../controllers/Review.controller');
const { extractUser, requireAuth } = require('../middleware/auth');
const { reviewValidation } = require('../validators/product.validator');
const { validate } = require('../middleware/validate');

router.get('/:productId', reviewController.getReviews);
router.post('/:productId', extractUser, requireAuth, reviewValidation, validate, reviewController.createReview);

module.exports = router;
