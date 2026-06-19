const axios = require('axios');
const cartRepository = require('../repositories/Cart.repository');
const orderRepository = require('../repositories/Order.repository');
const { AppError } = require('../../../shared/errors');
const logger = require('../../../shared/logger');

class ProductClient {
  async getProduct(productId) {
    try {
      const { data } = await axios.get(`${process.env.PRODUCT_SERVICE_URL}/api/products/${productId}`);
      return data.data;
    } catch {
      throw new AppError('Product not found', 404);
    }
  }

  async decrementStock(productId, quantity) {
    try {
      await axios.patch(`${process.env.PRODUCT_SERVICE_URL}/api/products/${productId}/stock`, {
        quantity: -quantity,
      });
    } catch (err) {
      logger.warn(`Stock update failed for ${productId}: ${err.message}`);
    }
  }
}

const productClient = new ProductClient();

class CartService {
  calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async getCart(userId) {
    const cart = await cartRepository.findByUserId(userId);
    const total = this.calculateTotal(cart.items);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    return { items: cart.items, total, itemCount };
  }

  async addItem(userId, productId, quantity = 1) {
    const product = await productClient.getProduct(productId);
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

    const cart = await cartRepository.findByUserId(userId);
    const existingIndex = cart.items.findIndex((i) => i.productId === productId);

    if (existingIndex >= 0) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > product.stock) throw new AppError('Insufficient stock', 400);
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || '',
        stock: product.stock,
      });
    }

    await cartRepository.save(cart);
    return this.getCart(userId);
  }

  async updateItem(userId, productId, quantity) {
    if (quantity < 1) throw new AppError('Quantity must be at least 1', 400);

    const product = await productClient.getProduct(productId);
    if (quantity > product.stock) throw new AppError('Insufficient stock', 400);

    const cart = await cartRepository.findByUserId(userId);
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new AppError('Item not in cart', 404);

    item.quantity = quantity;
    await cartRepository.save(cart);
    return this.getCart(userId);
  }

  async removeItem(userId, productId) {
    const cart = await cartRepository.findByUserId(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cartRepository.save(cart);
    return this.getCart(userId);
  }

  async clearCart(userId) {
    await cartRepository.clear(userId);
    return { items: [], total: 0, itemCount: 0 };
  }
}

class OrderService {
  async checkout(userId, shippingAddress, userEmail) {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart.items.length) throw new AppError('Cart is empty', 400);

    for (const item of cart.items) {
      const product = await productClient.getProduct(item.productId);
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.name}`, 400);
      }
    }

    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await orderRepository.create({
      userId,
      items: cart.items.map(({ productId, name, price, quantity, image }) => ({
        productId, name, price, quantity, image,
      })),
      totalPrice,
      shippingAddress,
      status: 'Pending',
    });

    for (const item of cart.items) {
      await productClient.decrementStock(item.productId, item.quantity);
    }

    await cartRepository.clear(userId);

    this.sendOrderConfirmation(order, userEmail).catch((err) =>
      logger.warn(`Order confirmation email failed: ${err.message}`)
    );

    return order;
  }

  async sendOrderConfirmation(order, email) {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/order-confirmation`, {
      email,
      orderId: order._id,
      totalPrice: order.totalPrice,
      items: order.items,
    });
  }

  async getOrders(userId, query) {
    return orderRepository.findByUserId(userId, {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
    });
  }

  async getOrderById(userId, orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);
    if (order.userId !== userId) throw new AppError('Access denied', 403);
    return order;
  }
}

class AdminOrderService {
  async getAllOrders(query) {
    return orderRepository.findAll({
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 20,
      status: query.status || '',
    });
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400);

    const order = await orderRepository.updateStatus(orderId, status);
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }

  async getStats() {
    return orderRepository.getStats();
  }
}

module.exports = {
  cartService: new CartService(),
  orderService: new OrderService(),
  adminOrderService: new AdminOrderService(),
};
