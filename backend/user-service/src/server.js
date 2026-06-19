require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('../../shared/logger');

process.env.SERVICE_NAME = 'user-service';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(require('../../shared/sanitize'));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/health', (req, res) => res.json({ success: true, service: 'user-service' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`User Service running on port ${PORT}`));

module.exports = app;

