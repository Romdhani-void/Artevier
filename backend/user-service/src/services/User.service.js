const jwt = require('jsonwebtoken');
const axios = require('axios');
const userRepository = require('../repositories/User.repository');
const { AppError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new AppError('Email already registered', 409);

    const user = await userRepository.create({ ...data, role: 'customer' });

    this.sendWelcomeEmail(user).catch((err) => logger.warn(`Welcome email failed: ${err.message}`));

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const token = this.generateToken(user);
    const userObj = user.toJSON();
    return { user: userObj, token };
  }

  async sendWelcomeEmail(user) {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/welcome`, {
      email: user.email,
      firstName: user.firstName,
    });
  }
}

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateProfile(userId, data) {
    const allowed = ['firstName', 'lastName', 'phone', 'address'];
    const update = {};
    allowed.forEach((key) => {
      if (data[key] !== undefined) update[key] = data[key];
    });

    const user = await userRepository.update(userId, update);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByEmailWithPassword(
      (await userRepository.findById(userId)).email
    );
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    user.password = newPassword;
    await user.save();
    return { message: 'Password updated successfully' };
  }
}

class AdminUserService {
  async getAllUsers(query) {
    return userRepository.findAll(query);
  }

  async updateUserRole(userId, role) {
    const user = await userRepository.update(userId, { role });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async deleteUser(userId) {
    const user = await userRepository.delete(userId);
    if (!user) throw new AppError('User not found', 404);
    return { message: 'User deleted successfully' };
  }

  async getStats() {
    const total = await userRepository.countAll();
    return { totalUsers: total };
  }
}

module.exports = {
  authService: new AuthService(),
  userService: new UserService(),
  adminUserService: new AdminUserService(),
};
