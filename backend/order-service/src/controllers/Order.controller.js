const { asyncHandler } = require('../../../shared/errors');
const { orderService, adminOrderService } = require('../services/Order.service');

class OrderController {
  checkout = asyncHandler(async (req, res) => {
    const order = await orderService.checkout(
      req.user.id,
      req.body.shippingAddress,
      req.body.shippingAddress.email || req.user.email
    );
    res.status(201).json({ success: true, data: order });
  });

  getOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getOrders(req.user.id, req.query);
    res.json({ success: true, data: orders });
  });

  getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.user.id, req.params.id);
    res.json({ success: true, data: order });
  });
}

class AdminOrderController {
  getOrders = asyncHandler(async (req, res) => {
    const orders = await adminOrderService.getAllOrders(req.query);
    res.json({ success: true, data: orders });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const order = await adminOrderService.updateOrderStatus(req.params.id, req.body.status);
    res.json({ success: true, data: order });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await adminOrderService.getStats();
    res.json({ success: true, data: stats });
  });
}

module.exports = { orderController: new OrderController(), adminOrderController: new AdminOrderController() };
