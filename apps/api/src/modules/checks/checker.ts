import { db } from '../../db/index.ts';
import { checks, services } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';

interface CheckResult {
  isUp: boolean;
  statusCode: number | null;
  latency: number;
  errorMsg: string | null;
}

async function pingUrl(url: string): Promise<CheckResult> {
  const start = Date.now();

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000), // 10s hard timeout
    });

    const latency = Date.now() - start;

    return {
      isUp: response.ok,
      statusCode: response.status,
      latency,
      errorMsg: null,
    };
  } catch (err: unknown) {
    const latency = Date.now() - start;
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';

    return {
      isUp: false,
      statusCode: null,
      latency,
      errorMsg,
    };
  }
}

export async function runCheck(serviceId: number, url: string): Promise<void> {
  const result = await pingUrl(url);

  // Record the check
  db.insert(checks)
    .values({
      serviceId,
      isUp: result.isUp,
      statusCode: result.statusCode,
      latency: result.latency,
      errorMsg: result.errorMsg,
      checkedAt: new Date(),
    })
    .run();

  // Update cached status on service
  db.update(services)
    .set({
      status: result.isUp ? 'UP' : 'DOWN',
      lastChecked: new Date(),
    })
    .where(eq(services.id, serviceId))
    .run();

  console.log(
    `[CHECK] ${url} — ${result.isUp ? 'UP' : 'DOWN'} | ${result.statusCode ?? 'no response'} | ${result.latency}ms${result.errorMsg ? ` | ${result.errorMsg}` : ''}`
  );
}