import { LeadPriority, LeadStatus, ProductType } from "@prisma/client";
import { z } from "zod";

export const createLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160).optional(),
  phone: z.string().trim().min(7).max(32),
  productType: z.nativeEnum(ProductType),
  message: z.string().trim().max(2000).optional(),
  sourcePage: z.string().trim().url().max(500).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  metadata: z.record(z.unknown()).optional()
});

export const updateLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(160).optional(),
  phone: z.string().trim().min(7).max(32).optional(),
  productType: z.nativeEnum(ProductType).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  notes: z.string().trim().max(4000).optional()
});

export const listLeadsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(LeadStatus).optional(),
  productType: z.nativeEnum(ProductType).optional(),
  currentAgentId: z.string().cuid().optional(),
  search: z.string().trim().max(120).optional()
});

export const handoffLeadSchema = z.object({
  reason: z.string().trim().max(500).optional(),
  preferredAgentId: z.string().cuid().optional(),
  forceReassign: z.boolean().optional().default(false)
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;
export type HandoffLeadInput = z.infer<typeof handoffLeadSchema>;