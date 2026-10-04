import { NextRequest, NextResponse } from "next/server";
import { generateHeraReply, HeraAiError } from "@/lib/hera/openai";
import { checkHeraChatRateLimit } from "@/lib/hera/rate-limit";
import type { HeraConversationMessage } from "@/lib/hera/types";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 200_000;
const MAX_MESSAGES = 51;
const MAX_VISITOR_MESSAGES = 25;
const MAX_MESSAGE_CHARS = 1_800;
const MAX_HISTORY_CHARS = 28_000;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error: message }, { status, headers });
}

function getClientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown-client";
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return jsonError("El mensaje es demasiado grande.", 413);

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonError("El mensaje es demasiado grande.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("No pudimos leer el mensaje.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("La solicitud no es válida.", 400);
  }

  const data = body as Record<string, unknown>;
  if (!Array.isArray(data.turns) || data.turns.length === 0 || data.turns.length > MAX_MESSAGES) {
    return jsonError("La conversación no es válida.", 400);
  }

  let turns: HeraConversationMessage[] = [];
  let totalChars = 0;
  let visitorCount = 0;
  for (const item of data.turns) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return jsonError("La conversación no es válida.", 400);
    }
    const turn = item as Record<string, unknown>;
    if ((turn.role !== "user" && turn.role !== "assistant") || typeof turn.content !== "string") {
      return jsonError("La conversación no es válida.", 400);
    }
    const content = turn.content.replace(CONTROL_CHARACTERS, "").trim();
    if (!content || content.length > MAX_MESSAGE_CHARS) {
      return jsonError("Uno de los mensajes no es válido.", 400);
    }
    totalChars += content.length;
    if (turn.role === "user") visitorCount += 1;
    if (visitorCount > MAX_VISITOR_MESSAGES) {
      return jsonError("La conversación alcanzó el límite permitido.", 413);
    }
    turns.push({ role: turn.role, content });
  }

  if (turns.at(-1)?.role !== "user" || visitorCount === 0) {
    return jsonError("Envía un mensaje para continuar.", 400);
  }
  if (data.suppressContactOffer !== undefined && typeof data.suppressContactOffer !== "boolean") {
    return jsonError("La solicitud no es válida.", 400);
  }

  const limit = checkHeraChatRateLimit(getClientKey(request));
  if (!limit.allowed) {
    return jsonError("HERA ha recibido varios mensajes. Intenta nuevamente en unos minutos.", 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  let historyTrimmed = false;
  if (totalChars > MAX_HISTORY_CHARS) {
    historyTrimmed = true;
    const firstVisitorIndex = turns.findIndex((turn) => turn.role === "user");
    const keep = new Set<number>();
    let keptChars = 0;
    if (firstVisitorIndex >= 0) {
      keep.add(firstVisitorIndex);
      keptChars += turns[firstVisitorIndex].content.length;
      if (firstVisitorIndex > 0 && turns[0].role === "assistant") {
        keep.add(0);
        keptChars += turns[0].content.length;
      }
    }
    for (let index = turns.length - 1; index >= 0; index -= 1) {
      if (keep.has(index)) continue;
      const turnLength = turns[index].content.length;
      if (keptChars + turnLength <= MAX_HISTORY_CHARS) {
        keep.add(index);
        keptChars += turnLength;
      }
    }
    turns = turns.filter((_, index) => keep.has(index));
  }

  try {
    const reply = await generateHeraReply(turns, data.suppressContactOffer === true, historyTrimmed);
    return NextResponse.json(reply, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof HeraAiError && error.kind === "not-configured") {
      return jsonError("HERA no está disponible temporalmente.", 503);
    }
    if (error instanceof HeraAiError && error.kind === "rate-limited") {
      return jsonError("HERA no puede responder ahora. Intenta nuevamente en unos segundos.", 429);
    }
    return jsonError("Estoy teniendo dificultad para responder en este momento. Intenta nuevamente en unos segundos.", 502);
  }
}
