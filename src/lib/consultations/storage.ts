import "server-only";
import type { PersistedHeraLead } from "@/lib/hera/supabase-leads";

export class ConsultationStorageError extends Error {
  constructor(public readonly code: string, message: string, public readonly status: number | null = null) {
    super(message);
  }
}

/** Consultation-only persistence: preserve HERA's existing behavior and RLS. */
export async function storeConsultationLead(lead: PersistedHeraLead): Promise<void> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new ConsultationStorageError("STORAGE_NOT_CONFIGURED", "Required storage configuration is missing");

  const headers: Record<string, string> = {
    apikey: key, "Content-Type": "application/json", Prefer: "return=minimal",
  };
  // Legacy service-role JWTs use Bearer auth. New secret keys use apikey only.
  if (key.split(".").length === 3) headers.Authorization = `Bearer ${key}`;

  let response: Response;
  try {
    response = await fetch(new URL("/rest/v1/hera_leads", url), {
      method: "POST", headers, body: JSON.stringify(lead), cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new ConsultationStorageError("STORAGE_REQUEST_FAILED", "Storage request failed or timed out");
  }
  if (response.ok) return;

  const payload = await response.json().catch(() => null) as { code?: unknown; message?: unknown } | null;
  const code = typeof payload?.code === "string" && /^[A-Z0-9_]{1,40}$/i.test(payload.code) ? payload.code : "STORAGE_HTTP_ERROR";
  let message = typeof payload?.message === "string" ? payload.message : "Storage returned an unsuccessful response";
  for (const privateValue of [key, ...Object.values(lead)]) {
    if (typeof privateValue === "string" && privateValue) message = message.split(privateValue).join("[redacted]");
  }
  message = message.replace(/eyJ[\w.-]+|sb_(?:secret|publishable)_[\w-]+|\b(?:sk-|re_)[\w-]+/g, "[redacted token]")
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[redacted email]")
    .replace(/[\r\n\u0000-\u001f]/g, " ").slice(0, 240);
  throw new ConsultationStorageError(code, message, response.status);
}
