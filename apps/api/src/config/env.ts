import 'dotenv/config';

export const config = {
  PORT: process.env.PORT || 3000,
  DB_PATH: process.env.DB_PATH || './statusping.db',
  CHECK_INTERVAL_MS: parseInt(process.env.CHECK_INTERVAL_MS || '60000'),
};
