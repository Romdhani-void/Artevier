const User = require('../models/User.model');

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findById(id) {
    return User.findById(id);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findAll({ page = 1, limit = 10, search = '' } = {}) {
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async countAll() {
    return User.countDocuments();
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
