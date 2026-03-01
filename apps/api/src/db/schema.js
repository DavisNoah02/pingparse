import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const services = sqliteTable('services', {
  id:           integer('id').primaryKey({ autoIncrement: true }),
  name:         text('name').notNull(),
  url:          text('url').notNull().unique(),
  interval:     integer('interval').notNull().default(60),
  status:       text('status', { enum: ['PENDING', 'UP', 'DOWN'] }).notNull().default('PENDING'),
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastChecked:  integer('last_checked', { mode: 'timestamp' }),
  createdAt:    integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const checks = sqliteTable('checks', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  serviceId:   integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  statusCode:  integer('status_code'),
  latency:     integer('latency').notNull(),
  isUp:        integer('is_up', { mode: 'boolean' }).notNull(),
  errorMsg:    text('error_msg'),
  checkedAt:   integer('checked_at', { mode: 'timestamp' }).notNull(),
});