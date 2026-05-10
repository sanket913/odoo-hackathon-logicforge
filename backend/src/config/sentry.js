const Sentry = require('@sentry/node');
const env = require('./env');

const initSentry = (app) => {
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0
  });
};

module.exports = { Sentry, initSentry };
