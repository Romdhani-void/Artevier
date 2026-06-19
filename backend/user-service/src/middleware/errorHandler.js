const { AppError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate field value' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = { errorHandler, notFoundHandler };
