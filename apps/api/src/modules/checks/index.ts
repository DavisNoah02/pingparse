import { Router } from 'express';
import { db } from '../../db/index.ts';
import { checks } from '../../db/schema.ts';
import { eq, desc } from 'drizzle-orm';

export const checksRouter = Router();

// GET /api/checks/:serviceId — last 50 checks for a service
checksRouter.get('/:serviceId', (req, res, next) => {
  try {
    const serviceId = parseInt(String(req.params['serviceId'] ?? ''));
    if (isNaN(serviceId)) {
      res.status(400).json({ error: { message: 'Invalid serviceId', status: 400 } });
      return;
    }

    const results = db
      .select()
      .from(checks)
      .where(eq(checks.serviceId, serviceId))
      .orderBy(desc(checks.checkedAt))
      .limit(50)
      .all();

    res.json({ data: results });
  } catch (err) {
    next(err);
  }
});