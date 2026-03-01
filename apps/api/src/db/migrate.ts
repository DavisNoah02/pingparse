import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { config } from '../config/env.ts';

const sqlite = new Database(config.DB_PATH);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: './drizzle' });

console.log('✅ Migrations applied successfully');
sqlite.close();