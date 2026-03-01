import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  url: z.string().url('Must be a valid URL'),
  interval: z.number().int().min(30).max(86400).default(60),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  interval: z.number().int().min(30).max(86400).optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;