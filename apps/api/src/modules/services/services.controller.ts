import { Request, Response, NextFunction } from 'express';
import { servicesService, ServiceNotFoundError, ServiceUrlConflictError } from './services.service.ts';
import { createServiceSchema, updateServiceSchema } from './services.schema.ts';

export const servicesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await servicesService.getAll();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params['id'] ?? ''))  ;
      if (isNaN(id)) {
        res.status(400).json({ error: { message: 'Invalid id', status: 400 } });
        return;
      }
      const data = await servicesService.getById(id);
      res.json({ data });
    } catch (err) {
      if (err instanceof ServiceNotFoundError) {
        res.status(404).json({ error: { message: err.message, status: 404 } });
        return;
      }
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createServiceSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Validation failed', issues: parsed.error.issues } });
        return;
      }
      const data = await servicesService.create(parsed.data);
      res.status(201).json({ data });
    } catch (err) {
      if (err instanceof ServiceUrlConflictError) {
        res.status(409).json({ error: { message: err.message, status: 409 } });
        return;
      }
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params['id'] ?? ''))  ;
      if (isNaN(id)) {
        res.status(400).json({ error: { message: 'Invalid id', status: 400 } });
        return;
      }
      const parsed = updateServiceSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Validation failed', issues: parsed.error.issues } });
        return;
      }
      const data = await servicesService.update(id, parsed.data);
      res.json({ data });
    } catch (err) {
      if (err instanceof ServiceNotFoundError) {
        res.status(404).json({ error: { message: err.message, status: 404 } });
        return;
      }
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(String(req.params['id'] ?? ''))  ;
      if (isNaN(id)) {
        res.status(400).json({ error: { message: 'Invalid id', status: 400 } });
        return;
      }
      await servicesService.remove(id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof ServiceNotFoundError) {
        res.status(404).json({ error: { message: err.message, status: 404 } });
        return;
      }
      next(err);
    }
  },
};