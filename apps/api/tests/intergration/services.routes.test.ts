import { describe, it, expect, vi } from 'vitest';
import supertest from 'supertest';
import express from 'express';

// hoisted — runs before ALL imports and mocks
const { testDb } = vi.hoisted(() => {
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  const { migrate } = require('drizzle-orm/better-sqlite3/migrator');
  const schema = require('../../src/db/schema.ts');

  const sqlite = new Database(':memory:');
  sqlite.pragma('foreign_keys = ON');
  const testDb = drizzle(sqlite, { schema });
  migrate(testDb, { migrationsFolder: './drizzle' });

  return { testDb };
});

vi.mock('../../src/db/index.ts', () => ({ db: testDb }));

vi.mock('../../src/scheduler/index.ts', () => ({
  scheduleService: vi.fn(),
  unscheduleService: vi.fn(),
  startScheduler: vi.fn(),
}));

import { servicesRouter } from '../../src/modules/services/index.ts';
import { errorHandler } from '../../src/middleware/errorHandler.ts';

const app = express();
app.use(express.json());
app.use('/api/services', servicesRouter);
app.use(errorHandler);

const request = supertest(app);

describe('POST /api/services', () => {
  it('creates a service with valid data', async () => {
    const res = await request.post('/api/services').send({
      name: 'Google',
      url: 'https://google.com',
      interval: 60,
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      name: 'Google',
      url: 'https://google.com',
      status: 'PENDING',
    });
  });

  it('returns 409 on duplicate URL', async () => {
    const res = await request.post('/api/services').send({
      name: 'Google Again',
      url: 'https://google.com',
      interval: 60,
    });
    expect(res.status).toBe(409);
  });

  it('returns 400 on invalid URL', async () => {
    const res = await request.post('/api/services').send({
      name: 'Bad',
      url: 'not-a-url',
      interval: 60,
    });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/services', () => {
  it('returns list of services', async () => {
    const res = await request.get('/api/services');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/services/:id', () => {
  it('returns 404 for non-existent service', async () => {
    const res = await request.get('/api/services/9999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await request.get('/api/services/abc');
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/services/:id', () => {
  it('deletes existing service', async () => {
    const created = await request.post('/api/services').send({
      name: 'To Delete',
      url: 'https://todelete.com',
      interval: 60,
    });
    const id = created.body.data.id;
    const res = await request.delete(`/api/services/${id}`);
    expect(res.status).toBe(204);
  });
});