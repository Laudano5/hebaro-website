import "server-only";

import type { HeraLeadSubmission } from "./types";

export type PersistedHeraLead = Omit<HeraLeadSubmission, "consent" | "website"> & {
  status: "new";
  source: "HERA" | "homepage-consultation";
  consent_at: string;
};

export class HeraStorageError extends Error {
  constructor(readonly code: string, readonly status: number | null = null) {
    super(code);
    this.name = "HeraStorageError";
  }
}

/** Server-only Supabase REST insert. The service role key never reaches the browser. */
export async function insertHeraLead(lead: PersistedHeraLead): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new HeraStorageError("STORAGE_NOT_CONFIGURED");
  }

  const headers: Record<string, string> = {
    apikey: serviceRoleKey,
    "Content-Type": "application/json",
    "Content-Profile": "public",
    Prefer: "return=minimal",
  };
  // Legacy service-role JWTs need Bearer auth; new secret keys use apikey only.
  if (serviceRoleKey.split(".").length === 3) headers.Authorization = `Bearer ${serviceRoleKey}`;

  let response: Response;
  try {
    const endpoint = new URL("/rest/v1/hera_leads", supabaseUrl);
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(lead),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new HeraStorageError("STORAGE_REQUEST_FAILED");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { code?: unknown } | null;
    const code = typeof payload?.code === "string" && /^(?:[0-9A-Z]{5}|PGRST[0-9]{3})$/.test(payload.code)
      ? payload.code : "STORAGE_HTTP_ERROR";
    // Never include database messages/details: they can echo private lead contents.
    throw new HeraStorageError(code, response.status);
  }
}
