export type Intent =
  | "MENU"
  | "MOTOR"
  | "LIFE"
  | "MEDICAL"
  | "POLICY_FOLLOW_UP"
  | "AGENT"
  | "HELP"
  | "UNKNOWN";

export type SessionState =
  | "ROOT_MENU"
  | "AWAITING_MOTOR_DETAILS"
  | "AWAITING_LIFE_DETAILS"
  | "AWAITING_MEDICAL_DETAILS"
  | "AWAITING_POLICY_DETAILS";

export type ProductInterest =
  | "MOTOR"
  | "LIFE"
  | "MEDICAL"
  | "POLICY_FOLLOW_UP"
  | "OTHER";

export type LeadStage =
  | "NEW"
  | "CAPTURE_IN_PROGRESS"
  | "QUALIFIED"
  | "HUMAN_HANDOFF_PENDING"
  | "HUMAN_ASSIGNED"
  | "CONTACTED"
  | "FOLLOW_UP_REQUESTED"
  | "CLOSED_WON"
  | "CLOSED_LOST"
  | "ARCHIVED";

export interface LeadUpdate {
  productInterest?: ProductInterest;
  stage?: LeadStage;
  notesAppend?: string;
}

export interface ChatbotDecision {
  intent: Intent;
  nextState: SessionState;
  reply: string;
  leadUpdate?: LeadUpdate;
}

export interface ChatbotContext {
  sessionState: SessionState;
  text: string | null;
  customerName?: string | null;
}