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
   * MIRROR TO PHP: Sends lead data to your Kenyan MySQL database
   */
  private async forwardToPHP(lead: { fullName: string | null; phoneE164: string; productType?: string | null; notes?: string | null }) {
    try {
      const phpUrl = "https://palatial.co.ke/whatsapp-webhook.php";
      
      // Using global fetch (Standard in Node 18+)
      await fetch(phpUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': process.env.INTERNAL_API_KEY || '' 
        },
        body: JSON.stringify({
          fullName: lead.fullName || 'Unknown',
          phone: lead.phoneE164,
          productType: lead.productType || 'General',
          message: lead.notes || ''
        })
      });
      console.log(`[Mirror] Success: Lead ${lead.phoneE164} sent to PHP server.`);
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
            source: existing.source,
            fullName: input.fullName,
            email: input.email ?? existing.email,
            phoneE164,
            productType: input.productType,
            priority: input.priority ?? existing.priority,
            status:
              existing.status === LeadStatus.CLOSED_WON || existing.status === LeadStatus.CLOSED_LOST
                ? existing.status
                : LeadStatus.QUALIFIED,
            sourcePage: input.sourcePage ?? existing.sourcePage,
            utmSource: input.utmSource ?? existing.utmSource,
            utmMedium: input.utmMedium ?? existing.utmMedium,
            utmCampaign: input.utmCampaign ?? existing.utmCampaign,
            metadata: safeJson({
              ...(typeof existing.metadata === "object" && existing.metadata ? existing.metadata : {}),
              ...(input.metadata ?? {})
            }),
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
            message: "Website lead updated",
            metadata: safeJson(input)
          }
        });

        // Sync Update to PHP
        this.forwardToPHP(updated);

        return this.getLeadByIdOrThrow(updated.id, tx);
      }

      const created = await tx.lead.create({
        data: {
          source: LeadSource.WEBSITE,
          status: LeadStatus.QUALIFIED,
          priority: input.priority ?? "NORMAL",
          productType: input.productType,
          fullName: input.fullName,
          email: input.email,
          phoneE164,
          sourcePage: input.sourcePage,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          metadata: safeJson(input.metadata),
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
          message: "Website lead created",
          metadata: safeJson(input)
        }
      });

      // Sync New Lead to PHP
      this.forwardToPHP(created);

      return this.getLeadByIdOrThrow(created.id, tx);
    });
  }

  public async upsertWhatsAppLead(input: {
    waId: string;
    fullName?: string | null;
  }) {
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
            source: existing.source,
            waId: input.waId,
            phoneE164,
            fullName: input.fullName ?? existing.fullName
          }
        });

        // Sync WhatsApp Update to PHP
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

      // Sync New WhatsApp Lead to PHP
      this.forwardToPHP(created);

      return this.getLeadByIdOrThrow(created.id, tx);
    });
  }

  public async applyDecision(leadId: string, leadUpdate?: LeadUpdate): Promise<void> {
    if (!leadUpdate) return;

    await prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({
        where: { id: leadId }
      });

      if (!existing) {
        throw new AppError(404, "Lead not found");
      }

      const data: Prisma.LeadUpdateInput = {};

      if (leadUpdate.productInterest) {
        data.productType = leadUpdate.productInterest as ProductType;
      }

      if (leadUpdate.stage) {
        data.status = leadUpdate.stage as LeadStatus;
      }

      if (leadUpdate.notesAppend) {
        data.notes = appendTimestampedNote(existing.notes, leadUpdate.notesAppend);
      }

      if (Object.keys(data).length > 0) {
        const updated = await tx.lead.update({
          where: { id: leadId },
          data
        });

        await tx.leadEvent.create({
          data: {
            leadId,
            type: leadUpdate.notesAppend ? LeadEventType.NOTE_ADDED : LeadEventType.UPDATED,
            actorType: ActorType.SYSTEM,
            message: "Lead updated from chatbot decision",
            metadata: safeJson(leadUpdate)
          }
        });

        // Sync Chatbot Logic (Insurance Type / Notes) to PHP
        this.forwardToPHP(updated);
      }
    });
  }

  public async listLeads(query: ListLeadsQuery) {
    const { page, perPage, status, productType, currentAgentId, search } = query;
    const skip = (page - 1) * perPage;

    const where: Prisma.LeadWhereInput = {
      ...(status ? { status } : {}),
      ...(productType ? { productType } : {}),
      ...(currentAgentId ? { currentAgentId } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phoneE164: { contains: search } }
            ]
          }
        : {})
    };

    const [total, items] = await prisma.$transaction([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: perPage,
        orderBy: [{ updatedAt: "desc" }],
        include: {
          currentAgent: true,
          assignments: {
            where: { status: "OPEN" },
            include: { agent: true },
            orderBy: { assignedAt: "desc" },
            take: 1
          }
        }
      })
    ]);

    return {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
      items
    };
  }

  public async getLeadByIdOrThrow(leadId: string, tx?: Tx) {
    const client = tx ?? prisma;

    const lead = await client.lead.findUnique({
      where: { id: leadId },
      include: {
        currentAgent: true,
        assignments: {
          include: { agent: true },
          orderBy: { assignedAt: "desc" }
        },
        events: {
          orderBy: { createdAt: "desc" },
          take: 30
        },
        sessions: {
          orderBy: { updatedAt: "desc" }
        }
      }
    });

    if (!lead) {
      throw new AppError(404, "Lead not found");
    }

    return lead;
  }

  public async updateLead(leadId: string, input: UpdateLeadInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.lead.findUnique({
        where: { id: leadId }
      });

      if (!existing) {
        throw new AppError(404, "Lead not found");
      }

      let phoneE164: string | undefined;

      if (input.phone) {
        phoneE164 = normalizeKenyanPhoneToE164(input.phone);

        const conflict = await tx.lead.findFirst({
          where: {
            phoneE164,
            NOT: { id: leadId }
          }
        });

        if (conflict) {
          throw new AppError(409, "Another lead already uses this phone number.");
        }
      }

      const updated = await tx.lead.update({
        where: { id: leadId },
        data: {
          fullName: input.fullName ?? existing.fullName,
          email: input.email ?? existing.email,
          phoneE164: phoneE164 ?? existing.phoneE164,
          productType: input.productType ?? existing.productType,
          status: input.status ?? existing.status,
          priority: input.priority ?? existing.priority,
          notes: input.notes
            ? appendTimestampedNote(existing.notes, input.notes)
            : existing.notes
        }
      });

      await tx.leadEvent.create({
        data: {
          leadId: updated.id,
          type: LeadEventType.UPDATED,
          actorType: ActorType.API,
          message: "Lead updated via API",
          metadata: safeJson(input)
        }
      });

      // Sync Manual API Updates to PHP
      this.forwardToPHP(updated);

      return this.getLeadByIdOrThrow(updated.id, tx);
    });
  }

  public async addEvent(input: {
    leadId: string;
    type: LeadEventType;
    actorType?: ActorType;
    actorId?: string;
    message?: string;
    metadata?: unknown;
  }) {
    return prisma.leadEvent.create({
      data: {
        leadId: input.leadId,
        type: input.type,
        actorType: input.actorType ?? ActorType.SYSTEM,
        actorId: input.actorId,
        message: input.message,
        metadata: safeJson(input.metadata)
      }
    });
  }
}