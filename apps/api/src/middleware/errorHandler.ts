import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.ts';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction): void {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';
  logger.error({ status, message, stack: err.stack });
  res.status(status).json({ error: { message, status } });
}