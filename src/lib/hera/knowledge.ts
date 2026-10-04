import { HERA_SERVICES } from "./types";

/** Reviewed facts only. Keep this stable prompt context free of unverified claims. */
export const HERA_KNOWLEDGE = {
  organization: "HEBARO",
  productsOutsideHera: ["HEBARO Marketplace", "ArtesenPR"],
  services: [
    {
      name: HERA_SERVICES[0],
      description: "Identify repetitive or inefficient processes that may benefit from artificial intelligence, workflow automation, intelligent assistants, or process automation.",
    },
    {
      name: HERA_SERVICES[1],
      description: "Custom software and digital systems designed around an organization's operational needs, workflows, users, and requirements.",
    },
    {
      name: HERA_SERVICES[2],
      description: "Connect existing applications, platforms, databases, APIs, and business processes so information and workflows can operate together more effectively.",
    },
    {
      name: HERA_SERVICES[3],
      description: "Technology-focused training and workforce development to strengthen practical technology capabilities.",
    },
  ],
} as const;
