require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const adminOrderRoutes = require('./routes/admin.order.routes');
const adminStatsRoutes = require('./routes/admin.stats.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('../../shared/logger');

process.env.SERVICE_NAME = 'order-service';

const app = express();
const PORT = process.env.PORT || 3003;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(require('../../shared/sanitize'));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/health', (req, res) => res.json({ success: true, service: 'order-service' }));

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Order Service running on port ${PORT}`));

module.exports = app;

