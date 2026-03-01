import app from './src/app.ts';
import { config } from './src/config/env.ts';
import { logger } from './src/config/logger.ts';
import { startScheduler } from './src/scheduler/index.ts';
import { closeDb } from './src/db/index.ts';

app.listen(config.PORT, () => {
  logger.info(`StatusPing API running on port ${config.PORT}`);
  startScheduler().catch((err) => logger.error({ err }, 'Scheduler failed to start'));
});

function shutdown(signal: string) {
  logger.info(`${signal} received — shutting down`);
  // Stop accepting new requests, drain existing ones
  server.close(() => {
    logger.info('HTTP server closed');
    closeDb();
    logger.info('Database connection closed');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

const server = app.listen(config.PORT, () => {
  logger.info(`StatusPing API running on port ${config.PORT}`);
  startScheduler().catch((err) => logger.error({ err }, 'Scheduler failed to start'));
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));