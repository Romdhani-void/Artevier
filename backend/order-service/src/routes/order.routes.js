const router = require('express').Router();
const { orderController } = require('../controllers/Order.controller');
const { extractUser } = require('../middleware/auth');
const { checkoutValidation } = require('../validators/order.validator');
const { validate } = require('../middleware/validate');

router.use(extractUser);

router.post('/checkout', checkoutValidation, validate, orderController.checkout);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
