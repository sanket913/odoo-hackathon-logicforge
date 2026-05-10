const { PrismaClient } = require('@prisma/client');
const env = require('./env');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

prisma.$on('error', (event) => {
  logger.error('Prisma error', event);
});

module.exports = prisma;
