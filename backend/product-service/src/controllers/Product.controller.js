const { asyncHandler } = require('../../../shared/errors');
const { productService } = require('../services/Product.service');

class ProductController {
  getProducts = asyncHandler(async (req, res) => {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, data: result });
  });

  getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  });

  getProductBySlug = asyncHandler(async (req, res) => {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json({ success: true, data: product });
  });

  getFeatured = asyncHandler(async (req, res) => {
    const products = await productService.getFeatured();
    res.json({ success: true, data: products });
  });

  getBestSellers = asyncHandler(async (req, res) => {
    const products = await productService.getBestSellers();
    res.json({ success: true, data: products });
  });

  getRelated = asyncHandler(async (req, res) => {
    const products = await productService.getRelated(req.params.id);
    res.json({ success: true, data: products });
  });

  getFilterOptions = asyncHandler(async (req, res) => {
    const options = productService.getFilterOptions();
    res.json({ success: true, data: options });
  });

  updateStock = asyncHandler(async (req, res) => {
    const product = await productService.updateStock(req.params.id, req.body.quantity);
    res.json({ success: true, data: product });
  });
}

module.exports = new ProductController();
