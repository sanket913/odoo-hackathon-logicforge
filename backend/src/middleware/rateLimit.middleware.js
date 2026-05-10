const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const isDevelopment = env.NODE_ENV === 'development';

const jsonError = (_req, res) =>
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  });

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isDevelopment ? 5000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment && ['GET', 'OPTIONS'].includes(req.method) && ['/health', '/ready'].includes(req.path),
  handler: jsonError
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isDevelopment ? 200 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonError
});

module.exports = { globalLimiter, authLimiter };
