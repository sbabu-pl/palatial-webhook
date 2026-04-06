import { ActorType, LeadEventType, Prisma } from "@prisma/client";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { ChatbotService } from "../chatbot/chatbot.service";
import type { SessionState } from "../chatbot/chatbot.types";
import { LeadService } from "../leads/leads.service";
import { HandoffService } from "../handoff/handoff.service";
import type {
  WhatsAppContact,
  WhatsAppMessage,
  WhatsAppStatus,
  WhatsAppWebhookPayload
} from "./whatsapp.types";

const chatbotService = new ChatbotService();
const leadService = new LeadService();
const handoffService = new HandoffService();

function sanitizeJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function extractTextFromMessage(message: WhatsAppMessage): string | null {
  if (message.type === "text") {
    return message.text?.body?.trim() ?? null;
  }

  if (message.type === "button") {
    return message.button?.text?.trim() ?? message.button?.payload?.trim() ?? null;
  }

  if (message.type === "interactive") {
    if (message.interactive?.type === "button_reply") {
      return (
        message.interactive.button_reply?.id?.trim() ??
        message.interactive.button_reply?.title?.trim() ??
        null
      );
    }

    if (message.interactive?.type === "list_reply") {
      return (
        message.interactive.list_reply?.id?.trim() ??
        message.interactive.list_reply?.title?.trim() ??
        null
      );
    }
  }

  return null;
}

export class WhatsAppService {
  public async handleWebhookPayload(payload: WhatsAppWebhookPayload): Promise<void> {
    const entries = payload.entry ?? [];

    for (const entry of entries) {
      const changes = entry.changes ?? [];

      for (const change of changes) {
        const value = change.value;
        if (!value) continue;

        if (value.statuses?.length) {
          this.logStatuses(value.statuses);
        }

        if (value.messages?.length) {
          await this.processMessages(value.messages, value.contacts ?? []);
        }
      }
    }
  }

  private async processMessages(messages: WhatsAppMessage[], contacts: WhatsAppContact[]): Promise<void> {
    const contactMap = new Map<string, string>();

    for (const contact of contacts) {
      if (contact.wa_id) {
        contactMap.set(contact.wa_id, contact.profile?.name ?? "");
      }
    }

    for (const message of messages) {
      const customerName = contactMap.get(message.from) ?? null;
      await this.processSingleMessage(message, customerName);
    }
  }

  private async processSingleMessage(
    message: WhatsAppMessage,
    customerName: string | null
  ): Promise<void> {
    const existing = await prisma.processedMessage.findUnique({
      where: { id: message.id }
    });

    if (existing?.status === "PROCESSED") {
      logger.info({ messageId: message.id }, "Skipping already processed message");
      return;
    }

    if (!existing) {
      await prisma.processedMessage.create({
        data: {
          id: message.id,
          waId: message.from,
          type: message.type,
          status: "RECEIVED",
          payloadJson: sanitizeJson(message)
        }
      });
    } else {
      await prisma.processedMessage.update({
        where: { id: message.id },
        data: {
          status: "RECEIVED",
          errorMessage: null,
          payloadJson: sanitizeJson(message)
        }
      });
    }

    try {
      const inboundText = extractTextFromMessage(message);

      const lead = await leadService.upsertWhatsAppLead({
        waId: message.from,
        fullName: customerName
      });

      const session = await prisma.chatSession.upsert({
        where: { waId: message.from },
        update: {
          name: customerName ?? undefined,
          leadId: lead.id,
          lastInboundAt: new Date(),
          status: "ACTIVE"
        },
        create: {
          waId: message.from,
          name: customerName ?? undefined,
          leadId: lead.id,
          state: "ROOT_MENU",
          status: "ACTIVE",
          lastInboundAt: new Date()
        }
      });

      await leadService.addEvent({
        leadId: lead.id,
        type: LeadEventType.WHATSAPP_INBOUND,
        actorType: ActorType.CUSTOMER,
        message: inboundText ?? `[non-text:${message.type}]`,
        metadata: message
      });

      const decision = chatbotService.getDecision({
        sessionState: session.state as SessionState,
        text: inboundText,
        customerName
      });

      await leadService.applyDecision(lead.id, decision.leadUpdate);

      let reply = decision.reply;
      let sessionStatus: "ACTIVE" | "HANDED_OFF" = "ACTIVE";

      if (decision.intent === "AGENT") {
        const handoffResult = await handoffService.handoffLead({
          leadId: lead.id,
          reason: "Requested by customer via WhatsApp"
        });

        if (handoffResult.status === "ASSIGNED") {
          sessionStatus = "HANDED_OFF";
          reply = `You’re now connected to ${handoffResult.agent.name}. A Palatial agent will contact you shortly.\n\nType MENU anytime.`;
        } else {
          reply = "Thanks. Your request has been queued for a human agent. A Palatial team member will contact you shortly.\n\nType MENU anytime.";
        }
      }

      await this.sendTextMessage(message.from, reply);

      await Promise.all([
        prisma.chatSession.update({
          where: { waId: message.from },
          data: {
            name: customerName ?? undefined,
            state: decision.nextState,
            status: sessionStatus,
            lastIntent: decision.intent,
            lastOutboundAt: new Date()
          }
        }),
        leadService.addEvent({
          leadId: lead.id,
          type: LeadEventType.WHATSAPP_OUTBOUND,
          actorType: ActorType.SYSTEM,
          message: reply
        }),
        prisma.processedMessage.update({
          where: { id: message.id },
          data: {
            status: "PROCESSED",
            processedAt: new Date(),
            errorMessage: null
          }
        })
      ]);

      logger.info(
        {
          waId: message.from,
          leadId: lead.id,
          messageId: message.id,
          intent: decision.intent,
          nextState: decision.nextState
        },
        "Inbound WhatsApp message processed"
      );
    } catch (error) {
      await prisma.processedMessage.update({
        where: { id: message.id },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        }
      });

      logger.error(
        {
          err: error,
          waId: message.from,
          messageId: message.id
        },
        "Failed processing inbound WhatsApp message"
      );
    }
  }

  private async sendTextMessage(to: string, body: string): Promise<void> {
    const url = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WhatsApp send failed: ${response.status} ${errorText}`);
    }
  }

  private logStatuses(statuses: WhatsAppStatus[]): void {
    for (const status of statuses) {
      logger.info(
        {
          messageId: status.id,
          status: status.status,
          recipientId: status.recipient_id,
          timestamp: status.timestamp
        },
        "WhatsApp delivery status update"
      );
    }
  }
}