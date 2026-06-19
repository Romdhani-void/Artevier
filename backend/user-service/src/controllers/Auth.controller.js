const { asyncHandler } = require('../../../shared/errors');
const { authService } = require('../services/User.service');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  });

  logout = asyncHandler(async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
}

module.exports = new AuthController();
