import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { HERA_SERVICES, type HeraService } from "@/lib/hera/types";
import { checkConsultationRateLimit } from "@/lib/hera/rate-limit";
import { insertHeraLead } from "@/lib/hera/supabase-leads";

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
  const serviceInterest = data.service_interest === null || data.service_interest === undefined || data.service_interest === "No estoy seguro"
    ? null
    : HERA_SERVICES.includes(data.service_interest as HeraService)
      ? data.service_interest as HeraService
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
    console.error("Consultation email configuration missing: RESEND_API_KEY, CONTACT_FROM_EMAIL, or CONTACT_TO_EMAIL");
    return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 503);
  }
  const submittedAt = new Date().toISOString();

  try {
    await insertHeraLead({
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
    const { data: sent, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      ...(email ? { replyTo: email } : {}),
      subject: "Nueva solicitud de consulta — HEBARO.com",
      text: [
        "NUEVA SOLICITUD DE CONSULTA",
        `Nombre: ${name}`,
        `Empresa: ${company || "No especificada"}`,
        `Email: ${email || "No proporcionado"}`,
        `Teléfono: ${phone || "No proporcionado"}`,
        `Área de interés: ${serviceInterest || "No especificada"}`,
        `Mensaje:\n${description}`,
        `Fecha: ${submittedAt}`,
        "Origen: HEBARO.com",
      ].join("\n\n"),
    });
    if (error || !sent?.id) {
      console.error("Consultation email provider did not accept the request");
      return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 502);
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    console.error("Consultation submission failed during lead storage or email delivery");
    return errorResponse("No pudimos enviar tu solicitud. Inténtalo nuevamente.", 502);
  }
}
