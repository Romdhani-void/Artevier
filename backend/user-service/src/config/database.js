const mongoose = require('mongoose');
const logger = require('../../../shared/logger');
const User = require('../models/User.model');

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@artisansinkstudio.com' });
    if (!existingAdmin) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@artisansinkstudio.com',
        password: 'Admin123!',
        role: 'admin',
        phone: '+1-555-0100',
        address: '123 Studio Lane, Portland, OR 97201',
      });
      logger.info('Admin user seeded: admin@artisansinkstudio.com / Admin123!');
    }
  } catch (error) {
    logger.error(`Admin seed error: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;