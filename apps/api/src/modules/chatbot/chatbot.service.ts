import { detectIntent } from "./chatbot.normalizer";
import type { ChatbotContext, ChatbotDecision, SessionState } from "./chatbot.types";

function mainMenu(): string {
  return [
    "Welcome to Palatial Insurance.",
    "",
    "Choose a service:",
    "1. Motor Insurance",
    "2. Life Insurance",
    "3. Medical Insurance",
    "4. Policy Follow-up",
    "5. Speak to an Agent",
    "",
    "Reply with a number.",
    "Type MENU anytime."
  ].join("\n");
}

function invalidMenuReply(): string {
  return [
    "Sorry, I didn’t understand that.",
    "",
    "Please reply with:",
    "1 for Motor Insurance",
    "2 for Life Insurance",
    "3 for Medical Insurance",
    "4 for Policy Follow-up",
    "5 to Speak to an Agent",
    "",
    "Type MENU anytime."
  ].join("\n");
}

export class ChatbotService {
  public getDecision(context: ChatbotContext): ChatbotDecision {
    const intent = detectIntent(context.text);

    if (!context.text) {
      return {
        intent: "UNKNOWN",
        nextState: context.sessionState,
        reply: "Please send a text reply so I can assist you.\n\nType MENU anytime."
      };
    }

    if (intent === "MENU" || intent === "HELP") {
      return {
        intent: "MENU",
        nextState: "ROOT_MENU",
        reply: mainMenu()
      };
    }

    // inside getDecision()

if (intent === "AGENT") {
  return {
    intent: "AGENT",
    nextState: "ROOT_MENU",
    reply:
      "You’ll be connected to an agent shortly. Please share your full name and the type of insurance you need if you haven’t already.",
    leadUpdate: {
      stage: "HUMAN_HANDOFF_PENDING"
    }
  };
}

    switch (context.sessionState) {
      case "AWAITING_MOTOR_DETAILS":
        return this.captureMotorDetails(context.text);

      case "AWAITING_LIFE_DETAILS":
        return this.captureLifeDetails(context.text);

      case "AWAITING_MEDICAL_DETAILS":
        return this.captureMedicalDetails(context.text);

      case "AWAITING_POLICY_DETAILS":
        return this.capturePolicyDetails(context.text);

      case "ROOT_MENU":
      default:
        return this.routeFromRoot(intent);
    }
  }

  private routeFromRoot(intent: string): ChatbotDecision {
    switch (intent) {
      case "MOTOR":
        return {
          intent: "MOTOR",
          nextState: "AWAITING_MOTOR_DETAILS",
          reply: [
            "Great choice.",
            "",
            "To prepare your motor insurance quote, please reply with:",
            "- Full name",
            "- Vehicle make/model",
            "- Cover type (Comprehensive or Third Party)",
            "",
            "Type MENU anytime."
          ].join("\n"),
          leadUpdate: {
            productInterest: "MOTOR",
            stage: "CAPTURE_IN_PROGRESS"
          }
        };

      case "LIFE":
        return {
          intent: "LIFE",
          nextState: "AWAITING_LIFE_DETAILS",
          reply: [
            "Great choice.",
            "",
            "To assist with life insurance, please reply with:",
            "- Full name",
            "- Age",
            "- Preferred monthly budget",
            "",
            "Type MENU anytime."
          ].join("\n"),
          leadUpdate: {
            productInterest: "LIFE",
            stage: "CAPTURE_IN_PROGRESS"
          }
        };

      case "MEDICAL":
        return {
          intent: "MEDICAL",
          nextState: "AWAITING_MEDICAL_DETAILS",
          reply: [
            "Great choice.",
            "",
            "To assist with medical insurance, please reply with:",
            "- Full name",
            "- Individual or family cover",
            "- Number of dependants if any",
            "",
            "Type MENU anytime."
          ].join("\n"),
          leadUpdate: {
            productInterest: "MEDICAL",
            stage: "CAPTURE_IN_PROGRESS"
          }
        };

      case "POLICY_FOLLOW_UP":
        return {
          intent: "POLICY_FOLLOW_UP",
          nextState: "AWAITING_POLICY_DETAILS",
          reply: [
            "Please reply with:",
            "- Policy number",
            "- Full name",
            "- Phone number",
            "",
            "Type MENU anytime."
          ].join("\n"),
          leadUpdate: {
            productInterest: "POLICY_FOLLOW_UP",
            stage: "FOLLOW_UP_REQUESTED"
          }
        };

      default:
        return {
          intent: "UNKNOWN",
          nextState: "ROOT_MENU",
          reply: invalidMenuReply()
        };
    }
  }

  private captureMotorDetails(text: string): ChatbotDecision {
    return {
      intent: "MOTOR",
      nextState: "ROOT_MENU",
      reply:
        "Thanks. We’ve received your motor insurance request. A Palatial agent will contact you shortly.\n\nType MENU anytime.",
      leadUpdate: {
        productInterest: "MOTOR",
        stage: "QUALIFIED",
        notesAppend: `Motor insurance details: ${text}`
      }
    };
  }

  private captureLifeDetails(text: string): ChatbotDecision {
    return {
      intent: "LIFE",
      nextState: "ROOT_MENU",
      reply:
        "Thanks. We’ve received your life insurance request. A Palatial agent will contact you shortly.\n\nType MENU anytime.",
      leadUpdate: {
        productInterest: "LIFE",
        stage: "QUALIFIED",
        notesAppend: `Life insurance details: ${text}`
      }
    };
  }

  private captureMedicalDetails(text: string): ChatbotDecision {
    return {
      intent: "MEDICAL",
      nextState: "ROOT_MENU",
      reply:
        "Thanks. We’ve received your medical insurance request. A Palatial agent will contact you shortly.\n\nType MENU anytime.",
      leadUpdate: {
        productInterest: "MEDICAL",
        stage: "QUALIFIED",
        notesAppend: `Medical insurance details: ${text}`
      }
    };
  }

  private capturePolicyDetails(text: string): ChatbotDecision {
    return {
      intent: "POLICY_FOLLOW_UP",
      nextState: "ROOT_MENU",
      reply:
        "Thanks. We’ve received your policy follow-up request. Our team will check and get back to you shortly.\n\nType MENU anytime.",
      leadUpdate: {
        productInterest: "POLICY_FOLLOW_UP",
        stage: "FOLLOW_UP_REQUESTED",
        notesAppend: `Policy follow-up details: ${text}`
      }
    };
  }
}