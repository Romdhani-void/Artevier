const { asyncHandler } = require('../../../shared/errors');
const { notificationService } = require('../services/Notification.service');

class NotificationController {
  welcome = asyncHandler(async (req, res) => {
    const result = await notificationService.sendWelcomeEmail(req.body);
    res.json({ success: true, data: result });
  });

  orderConfirmation = asyncHandler(async (req, res) => {
    const result = await notificationService.sendOrderConfirmation(req.body);
    res.json({ success: true, data: result });
  });
}

module.exports = new NotificationController();
