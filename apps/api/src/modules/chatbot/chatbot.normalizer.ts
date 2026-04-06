import type { Intent } from "./chatbot.types";

function clean(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\/\s-]/gu, "")
    .replace(/\s+/g, " ");
}

export function normalizeUserText(text: string | null | undefined): string {
  return clean(text ?? "");
}

export function detectIntent(text: string | null | undefined): Intent {
  const value = normalizeUserText(text);

  if (!value) return "UNKNOWN";

  const menuInputs = ["menu", "/menu", "start", "/start", "hi", "hello", "home"];
  if (menuInputs.includes(value)) return "MENU";

  const motorInputs = [
    "1",
    "/motor",
    "motor",
    "motor insurance",
    "car insurance",
    "vehicle insurance",
    "/quote motor"
  ];
  if (motorInputs.includes(value)) return "MOTOR";

  const lifeInputs = ["2", "/life", "life", "life insurance"];
  if (lifeInputs.includes(value)) return "LIFE";

  const medicalInputs = ["3", "/medical", "medical", "medical insurance", "health insurance"];
  if (medicalInputs.includes(value)) return "MEDICAL";

  const policyInputs = [
    "4",
    "/status",
    "status",
    "policy follow-up",
    "policy follow up",
    "follow up",
    "policy status"
  ];
  if (policyInputs.includes(value)) return "POLICY_FOLLOW_UP";

  const agentInputs = [
    "5",
    "/agent",
    "agent",
    "speak to an agent",
    "speak to agent",
    "human",
    "customer care"
  ];
  if (agentInputs.includes(value)) return "AGENT";

  const helpInputs = ["/help", "help"];
  if (helpInputs.includes(value)) return "HELP";

  return "UNKNOWN";
}