require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/database');
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const adminProductRoutes = require('./routes/admin.product.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('../../shared/logger');

process.env.SERVICE_NAME = 'product-service';

const app = express();
const PORT = process.env.PORT || 3002;
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

connectDB();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(require('../../shared/sanitize'));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use('/uploads', express.static(uploadDir));

app.get('/health', (req, res) => res.json({ success: true, service: 'product-service' }));

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/products', adminProductRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Product Service running on port ${PORT}`));

module.exports = app;

