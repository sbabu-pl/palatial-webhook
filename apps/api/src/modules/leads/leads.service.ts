import {
  ActorType,
  LeadEventType,
  LeadSource,
  LeadStatus,
  Prisma,
  ProductType
} from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/app-error";
import { normalizeKenyanPhoneToE164, normalizeWaIdToE164 } from "../../lib/phone";
import type {
  CreateLeadInput,
  ListLeadsQuery,
  UpdateLeadInput
} from "./leads.schemas";
import type { LeadUpdate } from "../chatbot/chatbot.types";

type Tx = Prisma.TransactionClient;

function safeJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function appendTimestampedNote(existing: string | null | undefined, next: string): string {
  const line = `[${new Date().toISOString()}] ${next}`;
  return existing ? `${existing}\n${line}` : line;
}

export class LeadService {
  /**
   * MIRROR TO PHP: Sends lead data to your Kenyan MySQL database.
   * Includes "Double Handshake" (API Key in headers and body) to bypass server filtering.
   */
  private async forwardToPHP(lead: { fullName: string | null; phoneE164: string; productType?: string | null; notes?: string | null }) {
    try {
      const phpUrl = process.env.PALATIAL_API_URL || "https://palatial.co.ke/crm/whatsapp-webhook.php";
      const apiKey = process.env.INTERNAL_API_KEY || "";

      await fetch(phpUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey 
        },
        body: JSON.stringify({
          fullName: lead.fullName || 'Unknown',
          phone: lead.phoneE164,
          productType: lead.productType || 'General',
          message: lead.notes || '',
          apiKey: apiKey // Double Handshake backup
        })
      });
      console.log(`[Mirror] Success: Lead ${lead.phoneE164} sent to PHP.`);
    } catch (error) {
      console.error("[Mirror] Failed to forward to PHP:", error);
    }
  }

  public async createOrUpdateWebsiteLead(input: CreateLeadInput) {
    return prisma.$transaction(async (tx) => {
      const phoneE164 = normalizeKenyanPhoneToE164(input.phone);

      const existing = await tx.lead.findFirst({
        where: {
          OR: [{ phoneE164 }, { waId: phoneE164.replace(/\D/g, "") }]
        }
      });

      if (existing) {
        const updated = await tx.lead.update({
          where: { id: existing.id },
          data: {
            fullName: input.fullName,
            email: input.email ?? existing.email,
            phoneE164,
            productType: input.productType,
            status:
              existing.status === LeadStatus.CLOSED_WON || existing.status === LeadStatus.CLOSED_LOST
                ? existing.status
                : LeadStatus.QUALIFIED,
            notes: input.message
              ? appendTimestampedNote(existing.notes, `Website message: ${input.message}`)
              : existing.notes
          }
        });

        await tx.leadEvent.create({
          data: {
            leadId: updated.id,
            type: LeadEventType.WEBSITE_CAPTURE,
            actorType: ActorType.API,
            message: "Website lead updated"
          }
        });

        this.forwardToPHP(updated);
        return this.getLeadByIdOrThrow(updated.id, tx);
      }

      const created = await tx.lead.create({
        data: {
          source: LeadSource.WEBSITE,
          status: LeadStatus.QUALIFIED,
          fullName: input.fullName,
          email: input.email,
          phoneE164,
          productType: input.productType,
          notes: input.message
            ? appendTimestampedNote(null, `Website message: ${input.message}`)
            : undefined
        }
      });

      await tx.leadEvent.create({
        data: {
          leadId: created.id,
          type: LeadEventType.WEBSITE_CAPTURE,
          actorType: ActorType.API,
          message: "Website lead created"
        }
      });

      this.forwardToPHP(created);
      return this.getLeadByIdOrThrow(created.id, tx);
    });
  }

  public async upsertWhatsAppLead(input: { waId: string; fullName?: string | null }) {
    return prisma.$transaction(async (tx) => {
      const phoneE164 = normalizeWaIdToE164(input.waId);

      const existing = await tx.lead.findFirst({
        where: {
          OR: [{ waId: input.waId }, { phoneE164 }]
        }
      });

      if (existing) {
        const updated = await tx.lead.update({
          where: { id: existing.id },
          data: {
            waId: input.waId,
            phoneE164,
            fullName: input.fullName ?? existing.fullName
          }
        });

        this.forwardToPHP(updated);
        return this.getLeadByIdOrThrow(updated.id, tx);
      }

      const created = await tx.lead.create({
        data: {
          source: LeadSource.WHATSAPP,
          status: LeadStatus.NEW,
          waId: input.waId,
          phoneE164,
          fullName: input.fullName ?? undefined
        }
      });

      await tx.leadEvent.create({
        data: {
          leadId: created.id,
          type: LeadEventType.CREATED,
          actorType: ActorType.SYSTEM,
          message: "Lead created from WhatsApp"
        }
      });

      this.forwardToPHP(created);
      return this.getLeadByIdOrThrow(created.id, tx);
    });
  }

  public async applyDecision(leadId: string, leadUpdate?: LeadUpdate): Promise<void> {
    if (!leadUpdate) return;

    await prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { id: leadId } });
      if (!existing) throw new AppError(404, "Lead not found");

      const data: Prisma.LeadUpdateInput = {};
      if (leadUpdate.productInterest) data.productType = leadUpdate.productInterest as ProductType;
      if (leadUpdate.stage) data.status = leadUpdate.stage as LeadStatus;
      if (leadUpdate.notesAppend) data.notes = appendTimestampedNote(existing.notes, leadUpdate.notesAppend);

      if (Object.keys(data).length > 0) {
        const updated = await tx.lead.update({ where: { id: leadId }, data });
        this.forwardToPHP(updated);
      }
    });
  }

  public async getLeadByIdOrThrow(leadId: string, tx?: Tx) {
    const client = tx ?? prisma;
    const lead = await client.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new AppError(404, "Lead not found");
    return lead;
  }

  public async updateLead(leadId: string, input: UpdateLeadInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({ where: { id: leadId } });
      if (!existing) throw new AppError(404, "Lead not found");

      const updated = await tx.lead.update({
        where: { id: leadId },
        data: {
          fullName: input.fullName ?? existing.fullName,
          email: input.email ?? existing.email,
          productType: input.productType ?? existing.productType,
          status: input.status ?? existing.status,
          notes: input.notes ? appendTimestampedNote(existing.notes, input.notes) : existing.notes
        }
      });

      this.forwardToPHP(updated);
      return this.getLeadByIdOrThrow(updated.id, tx);
    });
  }
}