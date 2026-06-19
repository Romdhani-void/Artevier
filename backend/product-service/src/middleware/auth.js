const { AppError } = require('../../../shared/errors');

const extractUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];
  if (userId) req.user = { id: userId, role };
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user?.id) return next(new AppError('Authentication required', 401));
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return next(new AppError('Admin access required', 403));
  next();
};

module.exports = { extractUser, requireAuth, requireAdmin };
