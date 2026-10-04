import type { HeraTurn } from "./types";

/** Only visitor-written content is included; no AI-generated facts are inferred. */
export function getVisitorTranscript(turns: HeraTurn[]): string {
  return getVisitorMessages(turns).join("\n\n");
}

export function getVisitorMessages(turns: HeraTurn[]): string[] {
  return turns
    .filter((turn) => turn.role === "user")
    .map((turn) => turn.content.trim())
    .filter(Boolean);
}
