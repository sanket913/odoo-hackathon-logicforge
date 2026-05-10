const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { Sentry } = require('../config/sentry');

const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  const isKnown = err instanceof ApiError;
  const statusCode = isKnown ? err.statusCode : 500;
  const code = isKnown ? err.code : 'INTERNAL_ERROR';
  const message = isKnown ? err.message : 'Something went wrong';

  if (!isKnown || statusCode >= 500) {
    logger.error(err);
    if (Sentry && typeof Sentry.captureException === 'function') {
      Sentry.captureException(err);
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {})
    }
  });
};

module.exports = { notFound, errorHandler };
