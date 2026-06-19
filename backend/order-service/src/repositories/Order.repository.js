const Order = require('../models/Order.model');

class OrderRepository {
  async create(data) {
    return Order.create(data);
  }

  async findById(id) {
    return Order.findById(id);
  }

  async findByUserId(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments({ userId }),
    ]);
    return { orders, total, page, pages: Math.ceil(total / limit) };
  }

  async findAll({ page = 1, limit = 20, status = '' } = {}) {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);
    return { orders, total, page, pages: Math.ceil(total / limit) };
  }

  async updateStatus(id, status) {
    return Order.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getStats() {
    const [totalOrders, revenueResult, statusCounts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    return {
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      recentOrders,
    };
  }
}

module.exports = new OrderRepository();
