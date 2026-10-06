export const HERA_LEAD_FAILURE_MESSAGE = "No pudimos enviar tu solicitud. Inténtalo nuevamente o utiliza nuestro formulario de contacto.";

/** One same-origin network request; never treat HTML or an empty 2xx as success. */
export async function submitHeraLead(payload: Record<string, unknown>): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);
  try {
    const response = await fetch("/api/hera/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null) as { ok?: unknown } | null;
    if (!response.ok || result?.ok !== true) throw new Error(HERA_LEAD_FAILURE_MESSAGE);
  } catch {
    throw new Error(HERA_LEAD_FAILURE_MESSAGE);
  } finally {
    clearTimeout(timeout);
  }
}
