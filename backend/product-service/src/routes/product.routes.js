const router = require('express').Router();
const productController = require('../controllers/Product.controller');

router.patch('/:id/stock', productController.updateStock);
router.get('/filters', productController.getFilterOptions);
router.get('/featured', productController.getFeatured);
router.get('/best-sellers', productController.getBestSellers);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelated);
router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts);

module.exports = router;
