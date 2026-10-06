import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { HERA_SERVICES, type HeraService } from "@/lib/hera/types";
import { checkConsultationRateLimit } from "@/lib/hera/rate-limit";
import { ConsultationStorageError, storeConsultationLead } from "@/lib/consultations/storage";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 20_000;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d().\s-]+$/;

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.replace(CONTROL_CHARACTERS, "").trim();
  return clean.length <= maxLength ? clean : null;
}

function optionalText(value: unknown, maxLength: number): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  return cleanText(value, maxLength) ?? undefined;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function errorResponse(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return errorResponse("La solicitud es demasiado grande.", 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return errorResponse("La solicitud es demasiado grande.", 413);
    }
    body = JSON.parse(raw);
  } catch {
    return errorResponse("No pudimos leer la solicitud.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("La solicitud no es válida.", 400);
  }

  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown-client";
  const limit = checkConsultationRateLimit(clientKey);
  if (!limit.allowed) {
    return errorResponse("Recibimos varias solicitudes. Intenta de nuevo más tarde.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const data = body as Record<string, unknown>;
  if (data.website !== undefined && (typeof data.website !== "string" || data.website.trim())) {
    return errorResponse("La solicitud no es válida.", 400);
  }
  const name = cleanText(data.name, 120);
  const company = optionalText(data.company, 200);
  const email = optionalText(data.email, 254);
  const phone = optionalText(data.phone, 40);
  const description = cleanText(data.description, 2_000);
  const service = optionalText(data.service_interest, 120);
  const serviceInterest = service === null || service === "" || service === "No estoy seguro"
    ? null
    : HERA_SERVICES.includes(service as HeraService)
      ? service as HeraService
      : undefined;

  if (!name) return errorResponse("Escribe tu nombre (máximo 120 caracteres).", 400);
  if (company === undefined) return errorResponse("El nombre de la empresa supera el límite permitido.", 400);
  if (email === undefined || phone === undefined) return errorResponse("Revisa los datos de contacto.", 400);
  if (!email && !phone) return errorResponse("Incluye un email o teléfono válido para poder contactarte.", 400);
  if (email && !EMAIL_PATTERN.test(email)) return errorResponse("El email no parece válido.", 400);
  if (phone && (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 7)) {
    return errorResponse("El teléfono no parece válido.", 400);
  }
  if (!description) return errorResponse("Cuéntanos brevemente qué necesitas (máximo 2000 caracteres).", 400);
  if (serviceInterest === undefined) return errorResponse("El área de servicio no es válida.", 400);
  if (data.consent !== true) return errorResponse("Confirma el consentimiento antes de enviar.", 400);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    console.error("CONSULTATION_EMAIL_FAILED", { code: "EMAIL_NOT_CONFIGURED" });
    return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 503);
  }
  const submittedAt = new Date().toISOString();
  const emailFields = [
    ["Nombre", name],
    ["Empresa", company || "No especificada"],
    ["Email", email || "No proporcionado"],
    ["Teléfono", phone || "No proporcionado"],
    ["Área de interés", serviceInterest || "No especificada"],
    ["Mensaje", description],
    ["Fecha", submittedAt],
    ["Origen", "HEBARO.com"],
  ];
  // Table layout and inline styles work in Outlook. All lead content is escaped.
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Nueva solicitud de consulta</title></head>
<body style="margin:0;padding:24px;background-color:#f3efe7;font-family:Arial,Helvetica,sans-serif;color:#031f24;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;">
    <tr><td style="padding:24px;background-color:#031f24;color:#ffffff;">
      <p style="margin:0 0 12px;font-size:18px;font-weight:bold;color:#d6bf9f;">HEBARO</p>
      <h1 style="margin:0;font-size:20px;line-height:1.4;">NUEVA SOLICITUD DE CONSULTA</h1>
    </td></tr>
    ${emailFields.map(([label, value]) => `<tr><td style="padding:14px 24px;border-bottom:1px solid #eeeeee;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:bold;">${escapeHtml(label)}:</p>
      <p style="margin:0;font-size:15px;line-height:1.6;word-wrap:break-word;">${escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>")}</p>
    </td></tr>`).join("")}
  </table>
</body></html>`;

  let storageSucceeded = false;
  try {
    await storeConsultationLead({
      name,
      company,
      email,
      phone,
      service_interest: serviceInterest,
      problem_summary: description,
      current_process: null,
      requirements: null,
      conversation_summary: description,
      status: "new",
      source: "homepage-consultation",
      consent_at: submittedAt,
    });
    storageSucceeded = true;
    console.info("CONSULTATION_STORAGE_SUCCESS");
  } catch (error) {
    console.error("CONSULTATION_STORAGE_FAILED", error instanceof ConsultationStorageError
      ? { code: error.code, message: error.message, status: error.status }
      : { code: "STORAGE_UNEXPECTED_ERROR" });
  }

  try {
    const { data: sent, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      ...(email ? { replyTo: email } : {}),
      subject: "Nueva solicitud de consulta — HEBARO.com",
      html,
      text: ["NUEVA SOLICITUD DE CONSULTA", ...emailFields.map(([label, value]) => `${label}:\n${value}`)].join("\n\n"),
    });
    if (error || !sent?.id) {
      console.error("CONSULTATION_EMAIL_FAILED", { code: "PROVIDER_NOT_ACCEPTED", storageSucceeded });
      return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 502);
    }
    console.info("CONSULTATION_EMAIL_SUCCESS", { storageSucceeded, degraded: !storageSucceeded });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("CONSULTATION_EMAIL_FAILED", { code: "PROVIDER_REQUEST_FAILED", storageSucceeded });
    return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 502);
  }
}
