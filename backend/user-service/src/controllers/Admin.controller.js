const { asyncHandler, AppError } = require('../../../shared/errors');
const { adminUserService } = require('../services/User.service');

class AdminController {
  getUsers = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await adminUserService.getAllUsers({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      search: search || '',
    });
    res.json({ success: true, data: result });
  });

  updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!['admin', 'customer'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }
    const user = await adminUserService.updateUserRole(req.params.id, role);
    res.json({ success: true, data: user });
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await adminUserService.deleteUser(req.params.id);
    res.json({ success: true, data: result });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await adminUserService.getStats();
    res.json({ success: true, data: stats });
  });
}

module.exports = new AdminController();
