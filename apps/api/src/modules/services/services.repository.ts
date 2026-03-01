import { eq } from 'drizzle-orm';
import { db } from '../../db/index.ts';
import { services } from '../../db/schema.ts';
import type { CreateServiceInput, UpdateServiceInput } from './services.schema.ts';

export const servicesRepository = {
  findAll() {
    return db.select().from(services).all();
  },

  findById(id: number) {
    return db.select().from(services).where(eq(services.id, id)).get();
  },

  findByUrl(url: string) {
    return db.select().from(services).where(eq(services.url, url)).get();
  },

  create(input: CreateServiceInput) {
    return db
      .insert(services)
      .values({
        ...input,
        status: 'PENDING',
        isActive: true,
        createdAt: new Date(),
      })
      .returning()
      .get();
  },

  update(id: number, input: UpdateServiceInput) {
    return db
      .update(services)
      .set(input)
      .where(eq(services.id, id))
      .returning()
      .get();
  },

  remove(id: number) {
    return db
      .delete(services)
      .where(eq(services.id, id))
      .returning()
      .get();
  },
};