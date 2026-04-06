import type { NextFunction, Request, Response } from "express";
import { LeadService } from "./leads.service";
import {
  createLeadSchema,
  handoffLeadSchema,
  listLeadsQuerySchema,
  updateLeadSchema
} from "./leads.schemas";
import { HandoffService } from "../handoff/handoff.service";

const leadService = new LeadService();
const handoffService = new HandoffService();

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createLeadSchema.parse(req.body);
    const lead = await leadService.createOrUpdateWebsiteLead(input);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

export async function listLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listLeadsQuerySchema.parse(req.query);
    const result = await leadService.listLeads(query);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getLead(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await leadService.getLeadByIdOrThrow(req.params.leadId);

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateLeadSchema.parse(req.body);
    const lead = await leadService.updateLead(req.params.leadId, input);

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
}

export async function handoffLead(req: Request, res: Response, next: NextFunction) {
  try {
    const input = handoffLeadSchema.parse(req.body);

    const result = await handoffService.handoffLead({
      leadId: req.params.leadId,
      reason: input.reason,
      preferredAgentId: input.preferredAgentId,
      forceReassign: input.forceReassign
    });

    res.status(result.status === "QUEUED" ? 202 : 200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}