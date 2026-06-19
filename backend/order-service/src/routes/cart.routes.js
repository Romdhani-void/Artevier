const router = require('express').Router();
const cartController = require('../controllers/Cart.controller');
const { extractUser } = require('../middleware/auth');
const { addToCartValidation } = require('../validators/order.validator');
const { validate } = require('../middleware/validate');

router.use(extractUser);

router.get('/', cartController.getCart);
router.post('/items', addToCartValidation, validate, cartController.addItem);
router.put('/items/:productId', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
