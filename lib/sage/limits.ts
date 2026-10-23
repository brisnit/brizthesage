/**
 * Cheap, in-memory guard rails for the Sage endpoint.
 * They live in each server instance’s memory (they reset on redeploy and are
 * per-instance on serverless hosts), so also set a monthly spend limit on the
 * provider account: that is the real ceiling.
 */

const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) ? Number(v) : d);
export const LIMITS = {
  perMinute: num(process.env.SAGE_PER_MINUTE, 6),
  perDay: num(process.env.SAGE_PER_DAY, 40),
  globalPerDay: num(process.env.SAGE_GLOBAL_PER_DAY, 400),
};

type Bucket = { minute: number[]; day: number; dayStart: number };
const visitors = new Map<string, Bucket>();
let global = { count: 0, dayStart: Date.now() };
const DAY = 86_400_000;

/** Returns null if allowed, or the number of seconds to wait. */
export function checkRate(key: string): number | null {
  const now = Date.now();
  if (now - global.dayStart > DAY) global = { count: 0, dayStart: now };
  if (global.count >= LIMITS.globalPerDay) return Math.ceil((global.dayStart + DAY - now) / 1000);

  let b = visitors.get(key);
  if (!b || now - b.dayStart > DAY) {
    b = { minute: [], day: 0, dayStart: now };
    visitors.set(key, b);
  }
  b.minute = b.minute.filter((t) => now - t < 60_000);
  if (b.day >= LIMITS.perDay) return Math.ceil((b.dayStart + DAY - now) / 1000);
  if (b.minute.length >= LIMITS.perMinute) return Math.ceil((b.minute[0] + 60_000 - now) / 1000);

  b.minute.push(now);
  b.day += 1;
  global.count += 1;
  // Keep the map from growing forever.
  if (visitors.size > 5000) visitors.delete(visitors.keys().next().value!);
  return null;
}
