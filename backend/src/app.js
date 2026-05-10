const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const prisma = require('./config/prisma');
const { initSentry } = require('./config/sentry');
const logger = require('./utils/logger');
const ApiResponse = require('./utils/ApiResponse');
const apiRoutes = require('./routes');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

initSentry(app);

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(globalLimiter);
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) }
  })
);

app.get('/health', (_req, res) => ApiResponse.success(res, { status: 'ok', uptime: process.uptime() }));

app.get('/ready', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    ApiResponse.success(res, { status: 'ready' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1', apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
