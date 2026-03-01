import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { config } from '../config/env.js';
import * as schema from './schema.js';

const sqlite = new Database(config.DB_PATH);

// WAL mode = better concurrent read performance
// foreign_keys = enforce referential integrity
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export const closeDb = () => sqlite.close();