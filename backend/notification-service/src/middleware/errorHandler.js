const logger = require('../../../shared/logger');

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal server error' });
};

module.exports = { errorHandler, notFoundHandler };
