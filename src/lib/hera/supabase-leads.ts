import "server-only";

import type { HeraLeadSubmission } from "./types";

export type PersistedHeraLead = Omit<HeraLeadSubmission, "consent" | "website"> & {
  status: "new";
  source: "HERA" | "homepage-consultation";
  consent_at: string;
};

type SupabaseErrorPayload = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

function safeDiagnostic(value: unknown, privateContactValues: Array<string | null>): string | null {
  if (typeof value !== "string") return null;
  let scrubbed = value;
  for (const privateValue of privateContactValues) {
    if (privateValue) scrubbed = scrubbed.split(privateValue).join("[redacted]");
  }
  return scrubbed
    .replace(/[\w.+-]+@[\w.-]+\.[A-Z]{2,}/gi, "[redacted email]")
    .replace(/(?<!\w)\+?\d[\d\s().-]{5,}\d(?!\w)/g, "[redacted phone]")
    .slice(0, 500);
}

/** Server-only Supabase REST insert. The service role key never reaches the browser. */
export async function insertHeraLead(lead: PersistedHeraLead): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("HERA lead storage is not configured");
  }

  let response: Response;
  try {
    const endpoint = new URL("/rest/v1/hera_leads", supabaseUrl);
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    });
  } catch {
    console.error("HERA Supabase request failed", {
      status: null,
      code: null,
      message: "No HTTP response received",
      details: null,
      hint: null,
    });
    throw new Error("HERA lead storage request failed");
  }

  if (!response.ok) {
    const responseText = await response.text();
    let errorPayload: SupabaseErrorPayload = {};
    try {
      errorPayload = JSON.parse(responseText) as SupabaseErrorPayload;
    } catch {
      // Keep the diagnostic allowlist when Supabase returns a non-JSON error.
    }

    console.error("HERA Supabase request failed", {
      status: response.status,
      code: safeDiagnostic(errorPayload.code, [lead.email, lead.phone]),
      message: safeDiagnostic(errorPayload.message, [lead.email, lead.phone]),
      details: safeDiagnostic(errorPayload.details, [lead.email, lead.phone]),
      hint: safeDiagnostic(errorPayload.hint, [lead.email, lead.phone]),
    });
    throw new Error("HERA lead storage request failed");
  }
}
