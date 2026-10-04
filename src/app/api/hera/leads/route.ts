import { NextRequest, NextResponse } from "next/server";
import { HERA_SERVICES, type HeraLeadSubmission, type HeraService } from "@/lib/hera/types";
import { checkLeadRateLimit } from "@/lib/hera/rate-limit";
import { generateHeraLeadSummary, type HeraLeadSummary } from "@/lib/hera/openai";
import { insertHeraLead } from "@/lib/hera/supabase-leads";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 200_000;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(CONTROL_CHARACTERS, "").trim();
  return cleaned.length <= maxLength ? cleaned : null;
}

function optionalText(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  return cleanText(value, maxLength);
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return jsonError("La solicitud es demasiado grande.", 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonError("La solicitud es demasiado grande.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("No pudimos leer la solicitud.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("La solicitud no es válida.", 400);
  }

  const data = body as Record<string, unknown>;
  if (typeof data.website === "string" && data.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown-client";
  const limit = checkLeadRateLimit(clientKey);
  if (!limit.allowed) {
    return jsonError("Recibimos varias solicitudes. Intenta de nuevo más tarde.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const name = cleanText(data.name, 120);
  const company = optionalText(data.company, 200);
  const email = optionalText(data.email, 254);
  const phone = optionalText(data.phone, 40);
  const serviceInterest = data.service_interest === null || data.service_interest === undefined
    ? null
    : HERA_SERVICES.includes(data.service_interest as HeraService)
      ? data.service_interest as HeraService
      : undefined;
  const currentProcess = optionalText(data.current_process, 1_000);
  const requirements = optionalText(data.requirements, 1_000);
  const visitorMessages = Array.isArray(data.visitor_messages) && data.visitor_messages.length <= 25
    ? data.visitor_messages.map((message) => cleanText(message, 1_800))
    : null;
  const cleanVisitorMessages = visitorMessages?.filter((message): message is string => Boolean(message)) ?? null;
  const conversationSummary = cleanVisitorMessages?.join("\n\n") ?? null;

  if (!name) return jsonError("Escribe tu nombre (máximo 120 caracteres).", 400);
  if (company === undefined) return jsonError("El nombre de la organización supera el límite permitido.", 400);
  if (email === undefined || phone === undefined) return jsonError("Revisa los datos de contacto.", 400);
  if (!email && !phone) return jsonError("Incluye un email o teléfono válido para poder contactarte.", 400);
  if (email && !EMAIL_PATTERN.test(email)) return jsonError("El email no parece válido.", 400);
  if (phone && (!/^[+\d().\s-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7)) {
    return jsonError("El teléfono no parece válido.", 400);
  }
  if (serviceInterest === undefined) return jsonError("El área de servicio no es válida.", 400);
  if (currentProcess === undefined || requirements === undefined) {
    return jsonError("Uno de los detalles del proyecto supera el límite permitido.", 400);
  }
  if (!cleanVisitorMessages?.length || !conversationSummary || conversationSummary.length > 48_000) {
    return jsonError("Comparte primero un poco de contexto sobre tu proyecto.", 400);
  }
  if (data.consent !== true) return jsonError("Confirma el consentimiento antes de enviar.", 400);

  let aiSummary: HeraLeadSummary | null = null;
  try {
    aiSummary = await generateHeraLeadSummary(cleanVisitorMessages);
  } catch {
    // Lead persistence must still work if the optional summary call is unavailable.
  }

  const fallbackSummary = cleanVisitorMessages.map((message, index) => `VISITOR ${index + 1}: ${message}`).join("\n\n").slice(0, 12_000);
  const formattedSummary = aiSummary
    ? [
        ["GOAL", aiSummary.goal],
        ["CURRENT PROCESS", aiSummary.currentProcess],
        ["PAIN POINTS", aiSummary.painPoints],
        ["SYSTEMS / TOOLS", aiSummary.systemsTools],
        ["REQUIREMENTS", aiSummary.requirements],
        ["HEBARO SERVICE FIT", aiSummary.serviceInterests.join(", ")],
        ["CONSTRAINTS", aiSummary.constraints],
        ["DESIRED OUTCOME", aiSummary.desiredOutcome],
        ["FOLLOW-UP NOTES", aiSummary.followUpNotes],
      ]
        .filter(([, value]) => value)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n") || fallbackSummary
    : fallbackSummary;

  const lead: HeraLeadSubmission = {
    name,
    company,
    email,
    phone,
    service_interest: aiSummary?.serviceInterests[0] ?? null,
    problem_summary: (aiSummary?.goal || cleanVisitorMessages[0]).slice(0, 2_000),
    current_process: aiSummary?.currentProcess.slice(0, 1_000) || null,
    requirements: aiSummary?.requirements.slice(0, 1_000) || null,
    conversation_summary: formattedSummary.slice(0, 12_000),
    consent: true,
    website: "",
  };

  try {
    await insertHeraLead({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      service_interest: lead.service_interest,
      problem_summary: lead.problem_summary,
      current_process: lead.current_process,
      requirements: lead.requirements,
      conversation_summary: lead.conversation_summary,
      status: "new",
      source: "HERA",
      consent_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "HERA lead storage is not configured") {
      return jsonError("El seguimiento de HERA todavía no está configurado. Intenta más tarde.", 503);
    }
    return jsonError("No pudimos enviar tu solicitud ahora. Intenta de nuevo más tarde.", 502);
  }
}
