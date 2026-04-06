import type { NextFunction, Request, Response } from "express";
import { AgentService } from "./agents.service";
import { createAgentSchema, updateAgentSchema } from "./agents.schemas";

const agentService = new AgentService();

export async function createAgent(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createAgentSchema.parse(req.body);
    const agent = await agentService.createAgent(input);

    res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
}

export async function listAgents(_req: Request, res: Response, next: NextFunction) {
  try {
    const agents = await agentService.listAgents();

    res.status(200).json({
      success: true,
      data: agents
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAgent(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateAgentSchema.parse(req.body);
    const agent = await agentService.updateAgent(req.params.agentId, input);

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
}