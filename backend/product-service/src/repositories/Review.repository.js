const Review = require('../models/Review.model');

class ReviewRepository {
  async create(data) {
    return Review.create(data);
  }

  async findByProduct(productId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find({ productId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments({ productId }),
    ]);
    return { reviews, total, page, pages: Math.ceil(total / limit) };
  }

  async findByProductAndUser(productId, userId) {
    return Review.findOne({ productId, userId });
  }

  async getAverageRating(productId) {
    const result = await Review.aggregate([
      { $match: { productId: new (require('mongoose').Types.ObjectId)(productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    return result[0] || { avgRating: 0, count: 0 };
  }
}

module.exports = new ReviewRepository();
