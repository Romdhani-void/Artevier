const router = require('express').Router();
const notificationController = require('../controllers/Notification.controller');

router.post('/welcome', notificationController.welcome);
router.post('/order-confirmation', notificationController.orderConfirmation);

module.exports = router;
