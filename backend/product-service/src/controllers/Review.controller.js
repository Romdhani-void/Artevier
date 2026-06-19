const { asyncHandler } = require('../../../shared/errors');
const { reviewService } = require('../services/Product.service');

class ReviewController {
  getReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getReviews(req.params.productId, req.query);
    res.json({ success: true, data: result });
  });

  createReview = asyncHandler(async (req, res) => {
    const userName = req.headers['x-user-name'] || req.body.userName || 'Customer';
    const review = await reviewService.createReview(
      req.params.productId,
      req.user.id,
      userName,
      req.body
    );
    res.status(201).json({ success: true, data: review });
  });
}

module.exports = new ReviewController();
