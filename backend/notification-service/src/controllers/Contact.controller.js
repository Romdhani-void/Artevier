const { asyncHandler } = require('../../../shared/errors');
const { contactService } = require('../services/Notification.service');

class ContactController {
  submit = asyncHandler(async (req, res) => {
    const result = await contactService.submit(req.body);
    res.status(201).json({ success: true, data: result });
  });
}

module.exports = new ContactController();
