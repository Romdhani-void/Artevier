const router = require('express').Router();
const { adminOrderController } = require('../controllers/Order.controller');
const { extractUser, requireAdmin } = require('../middleware/auth');

router.use(extractUser, requireAdmin);

router.get('/', adminOrderController.getOrders);
router.put('/:id/status', adminOrderController.updateStatus);

module.exports = router;
