require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const swaggerSpec = require('./config/swagger');
const { authMiddleware, optionalAuth } = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('../../shared/logger');

process.env.SERVICE_NAME = 'api-gateway';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
}));
// Do not parse JSON bodies globally — proxied services handle their own parsing
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ success: true, service: 'api-gateway', status: 'healthy' });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const createServiceProxy = (target, pathPrefix) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: (path) => `${pathPrefix}${path}`,
  on: {
    error: (err, req, res) => {
      logger.error(`Proxy error: ${err.message}`, { target });
      if (!res.headersSent) {
        res.status(503).json({ success: false, message: 'Service temporarily unavailable' });
      }
    },
  },
});

// Public auth routes
app.use('/api/auth', createServiceProxy(process.env.USER_SERVICE_URL, '/api/auth'));

// Public product routes
app.use('/api/products', optionalAuth, createServiceProxy(process.env.PRODUCT_SERVICE_URL, '/api/products'));
app.use('/api/reviews', optionalAuth, createServiceProxy(process.env.PRODUCT_SERVICE_URL, '/api/reviews'));
app.use('/api/uploads', createServiceProxy(process.env.PRODUCT_SERVICE_URL, '/uploads'));

// Protected user routes
app.use('/api/users', authMiddleware, createServiceProxy(process.env.USER_SERVICE_URL, '/api/users'));

// Protected order routes
app.use('/api/cart', authMiddleware, createServiceProxy(process.env.ORDER_SERVICE_URL, '/api/cart'));
app.use('/api/orders', authMiddleware, createServiceProxy(process.env.ORDER_SERVICE_URL, '/api/orders'));

// Admin routes (auth + role checked at service level)
app.use('/api/admin/products', authMiddleware, createServiceProxy(process.env.PRODUCT_SERVICE_URL, '/api/admin/products'));
app.use('/api/admin/orders', authMiddleware, createServiceProxy(process.env.ORDER_SERVICE_URL, '/api/admin/orders'));
app.use('/api/admin/users', authMiddleware, createServiceProxy(process.env.USER_SERVICE_URL, '/api/admin/users'));
app.use('/api/admin/stats', authMiddleware, createServiceProxy(process.env.ORDER_SERVICE_URL, '/api/admin/stats'));

// Notification routes
app.use('/api/contact', createServiceProxy(process.env.NOTIFICATION_SERVICE_URL, '/api/contact'));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

module.exports = app;

