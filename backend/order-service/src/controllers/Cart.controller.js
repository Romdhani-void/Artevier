const { asyncHandler } = require('../../../shared/errors');
const { cartService } = require('../services/Order.service');

class CartController {
  getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    res.json({ success: true, data: cart });
  });

  addItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItem(req.user.id, productId, quantity || 1);
    res.json({ success: true, data: cart });
  });

  updateItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await cartService.updateItem(req.user.id, req.params.productId, quantity);
    res.json({ success: true, data: cart });
  });

  removeItem = asyncHandler(async (req, res) => {
    const cart = await cartService.removeItem(req.user.id, req.params.productId);
    res.json({ success: true, data: cart });
  });

  clearCart = asyncHandler(async (req, res) => {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ success: true, data: cart });
  });
}

module.exports = new CartController();
