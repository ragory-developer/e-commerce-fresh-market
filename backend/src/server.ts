import app from './app';
import { config } from './config';
import logger from './utils/logger';
import prisma from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(config.port, () => {
      logger.info(`🚀 FreshCart API running on http://localhost:${config.port}`);
      logger.info(`📋 Health check: http://localhost:${config.port}/api/health`);
      logger.info(`🔥 Dashboard stats mounted: /api/user-dashboard/stats`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

// Trigger restart 4
