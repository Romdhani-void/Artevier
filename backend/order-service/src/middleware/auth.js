const { AppError } = require('../../../shared/errors');

const extractUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];
  const email = req.headers['x-user-email'];
  if (!userId) return next(new AppError('Authentication required', 401));
  req.user = { id: userId, role, email };
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return next(new AppError('Admin access required', 403));
  next();
};

module.exports = { extractUser, requireAdmin };
