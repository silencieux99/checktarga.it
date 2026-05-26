const CACHE_TTL_MS = 120_000;
const statsCache = new Map<string, { data: unknown; expires: number }>();

export function getAdminStatsCache(key: string) {
  const entry = statsCache.get(key);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
}

export function setAdminStatsCache(key: string, data: unknown) {
  statsCache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

export function invalidateAdminStatsCache() {
  statsCache.clear();
}
