const router = require('express').Router();
const adminProductController = require('../controllers/AdminProduct.controller');
const { extractUser, requireAdmin } = require('../middleware/auth');
const { productValidation } = require('../validators/product.validator');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');

router.use(extractUser, requireAdmin);

router.get('/inventory', adminProductController.getInventory);
router.get('/stats', adminProductController.getStats);
router.get('/', adminProductController.getProducts);
router.post('/', upload.array('images', 5), productValidation, validate, adminProductController.createProduct);
router.put('/:id', upload.array('images', 5), productValidation, validate, adminProductController.updateProduct);
router.delete('/:id', adminProductController.deleteProduct);

module.exports = router;
