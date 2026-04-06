import { AgentStatus } from "@prisma/client";
import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(7).max(32).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  acceptsWhatsapp: z.boolean().optional()
});

export const updateAgentSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(160).optional(),
  phone: z.string().trim().min(7).max(32).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  status: z.nativeEnum(AgentStatus).optional(),
  acceptsWhatsapp: z.boolean().optional()
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;