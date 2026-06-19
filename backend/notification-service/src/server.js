require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const contactRoutes = require('./routes/contact.routes');
const notificationRoutes = require('./routes/notification.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('../../shared/logger');

process.env.SERVICE_NAME = 'notification-service';

const app = express();
const PORT = process.env.PORT || 3004;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(require('../../shared/sanitize'));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/health', (req, res) => res.json({ success: true, service: 'notification-service' }));

app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Notification Service running on port ${PORT}`));

module.exports = app;

