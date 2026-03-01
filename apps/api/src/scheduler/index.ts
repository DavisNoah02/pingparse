import { db } from '../db/index.ts';
import { services } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { runCheck } from '../modules/checks/checker.ts';
import { logger } from '../config/logger.ts';

const activeTimers = new Map<number, NodeJS.Timeout>();

function scheduleService(serviceId: number, url: string, intervalSeconds: number): void {
  // Clear existing timer if rescheduling
  const existing = activeTimers.get(serviceId);
  if (existing) clearInterval(existing);

  // Run immediately on registration
  runCheck(serviceId, url).catch(console.error);

  // Then run on interval
  const timer = setInterval(() => {
    runCheck(serviceId, url).catch((err) => logger.error({ err }, 'Check failed'));
  }, intervalSeconds * 1000);

  activeTimers.set(serviceId, timer);
}

function unscheduleService(serviceId: number): void {
  const timer = activeTimers.get(serviceId);
  if (timer) {
    clearInterval(timer);
    activeTimers.delete(serviceId);
  }
}

export async function startScheduler(): Promise<void> {
  const activeServices = db
    .select()
    .from(services)
    .where(eq(services.isActive, true))
    .all();

  logger.info(`[SCHEDULER] Starting — ${activeServices.length} active services`);

  for (const service of activeServices) {
    scheduleService(service.id, service.url, service.interval);
  }
}

export { scheduleService, unscheduleService };