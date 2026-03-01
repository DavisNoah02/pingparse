import 'dotenv/config';

export const config = {
  PORT: process.env['PORT'] || 3000,
  DB_PATH: process.env['DB_PATH'] || './statusping.db',
  CHECK_INTERVAL_MS: parseInt(process.env['CHECK_INTERVAL_MS'] || '60000'),
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
};