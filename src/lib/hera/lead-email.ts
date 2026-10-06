import "server-only";
import { Resend } from "resend";
import type { PersistedHeraLead } from "./supabase-leads";

export class HeraEmailError extends Error {
  constructor(readonly code: string) { super(code); this.name = "HeraEmailError"; }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

/** HERA-only notifications using the existing verified consultation configuration. */
export async function sendHeraLeadEmail(lead: PersistedHeraLead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) throw new HeraEmailError("EMAIL_NOT_CONFIGURED");

  const fields = [
    ["Nombre", lead.name], ["Empresa", lead.company || "No especificada"],
    ["Email", lead.email || "No proporcionado"], ["Teléfono", lead.phone || "No proporcionado"],
    ["Área de interés", lead.service_interest || "No especificada"],
    ["Necesidad", lead.problem_summary || "No especificada"],
    ["Proceso actual", lead.current_process || "No especificado"],
    ["Requisitos", lead.requirements || "No especificados"],
    ["Resumen de la conversación", lead.conversation_summary],
    ["Fecha de consentimiento", lead.consent_at], ["Origen", "HERA — HEBARO.com"],
  ];
  const html = `<!doctype html><html lang="es"><body style="font-family:Arial,sans-serif;color:#29454f;">
    <h1 style="font-size:20px;">Nueva solicitud de consulta — HERA</h1>
    ${fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>")}</p>`).join("")}
  </body></html>`;
  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from, to, ...(lead.email ? { replyTo: lead.email } : {}),
      subject: "Nueva solicitud de consulta — HERA",
      html,
      text: ["NUEVA SOLICITUD DE CONSULTA — HERA", ...fields.map(([label, value]) => `${label}:\n${value}`)].join("\n\n"),
    }, { signal: AbortSignal.timeout(10_000) });
    if (error || !data?.id) throw new HeraEmailError("PROVIDER_NOT_ACCEPTED");
  } catch (error) {
    if (error instanceof HeraEmailError) throw error;
    throw new HeraEmailError("PROVIDER_REQUEST_FAILED");
  }
}
