interface WindowEntry {
  count: number;
  resetAt: number;
}

const windows = new Map<string, WindowEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const LEAD_MAX_REQUESTS = 5;
const CHAT_MAX_REQUESTS = 45;

/** Per-process fallback; replace with shared storage before multi-instance deployment. */
function checkRateLimit(key: string, maxRequests: number, now = Date.now()): { allowed: boolean; retryAfter: number } {
  if (windows.size > 2_000) {
    for (const [entryKey, entry] of windows) {
      if (entry.resetAt <= now) windows.delete(entryKey);
    }
  }

  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function checkLeadRateLimit(key: string, now = Date.now()) {
  return checkRateLimit(`lead:${key}`, LEAD_MAX_REQUESTS, now);
}

export function checkConsultationRateLimit(key: string, now = Date.now()) {
  return checkRateLimit(`consultation:${key}`, LEAD_MAX_REQUESTS, now);
}

export function checkHeraChatRateLimit(key: string, now = Date.now()) {
  return checkRateLimit(`chat:${key}`, CHAT_MAX_REQUESTS, now);
}
