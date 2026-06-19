const { asyncHandler } = require('../../../shared/errors');
const { userService } = require('../services/User.service');

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: user });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
    res.json({ success: true, data: result });
  });
}

module.exports = new UserController();
