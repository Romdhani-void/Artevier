const { asyncHandler } = require('../../../shared/errors');
const { adminProductService } = require('../services/Product.service');

const parseProductBody = (body) => ({
  name: body.name,
  description: body.description,
  price: parseFloat(body.price),
  material: body.material,
  color: body.color,
  shape: body.shape,
  stock: parseInt(body.stock, 10),
  dimensions: body.dimensions,
  weight: body.weight,
  featured: body.featured === 'true' || body.featured === true,
});

class AdminProductController {
  getProducts = asyncHandler(async (req, res) => {
    const result = await adminProductService.getAll(req.query);
    res.json({ success: true, data: result });
  });

  createProduct = asyncHandler(async (req, res) => {
    const product = await adminProductService.create(parseProductBody(req.body), req.files);
    res.status(201).json({ success: true, data: product });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const product = await adminProductService.update(req.params.id, parseProductBody(req.body), req.files);
    res.json({ success: true, data: product });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    const result = await adminProductService.delete(req.params.id);
    res.json({ success: true, data: result });
  });

  getInventory = asyncHandler(async (req, res) => {
    const inventory = await adminProductService.getInventory();
    res.json({ success: true, data: inventory });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await adminProductService.getStats();
    res.json({ success: true, data: stats });
  });
}

module.exports = new AdminProductController();
