export const HERA_SERVICES = [
  "IA y Automatización",
  "Software Personalizado",
  "Integración de Sistemas",
  "Capacitación & Upskilling",
] as const;

export type HeraService = (typeof HERA_SERVICES)[number];
export type HeraTurnRole = "user" | "assistant";

export interface HeraTurn {
  id: string;
  role: HeraTurnRole;
  content: string;
  readyForContact?: boolean;
  serviceInterests?: HeraService[];
}

export type HeraConversationMessage = Pick<HeraTurn, "role" | "content">;

export interface HeraAssistantResponse {
  message: string;
  readyForContact: boolean;
  serviceInterests: HeraService[];
}

export interface HeraLeadSubmission {
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  service_interest: HeraService | null;
  problem_summary: string | null;
  current_process: string | null;
  requirements: string | null;
  conversation_summary: string;
  consent: boolean;
  website: string;
}
