import type { HeraLeadSubmission, HeraService, HeraTurn } from "./types";
import { getVisitorMessages } from "./conversation";

/** Deterministic MVP extraction: preserves visitor text and does not infer facts. */
export function createLeadSubmission(input: {
  turns: HeraTurn[];
  selectedService: HeraService | null;
  name: string;
  company: string;
  email: string;
  phone: string;
}): Omit<HeraLeadSubmission, "consent" | "website" | "problem_summary" | "conversation_summary"> & { visitor_messages: string[] } {
  const visitorMessages = getVisitorMessages(input.turns);

  return {
    name: input.name.trim(),
    company: input.company.trim() || null,
    email: input.email.trim() || null,
    phone: input.phone.trim() || null,
    service_interest: input.selectedService,
    current_process: null,
    requirements: null,
    visitor_messages: visitorMessages,
  };
}
