const router = require('express').Router();
const { adminOrderController } = require('../controllers/Order.controller');
const { extractUser, requireAdmin } = require('../middleware/auth');

router.use(extractUser, requireAdmin);

router.get('/', adminOrderController.getStats);

module.exports = router;
