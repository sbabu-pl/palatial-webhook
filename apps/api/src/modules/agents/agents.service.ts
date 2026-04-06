import { AssignmentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/app-error";
import { normalizeKenyanPhoneToE164 } from "../../lib/phone";
import type { CreateAgentInput, UpdateAgentInput } from "./agents.schemas";

export class AgentService {
  public async createAgent(input: CreateAgentInput) {
    return prisma.agent.create({
      data: {
        name: input.name,
        email: input.email,
        phoneE164: input.phone ? normalizeKenyanPhoneToE164(input.phone) : undefined,
        capacity: input.capacity ?? 20,
        status: input.status ?? "AVAILABLE",
        acceptsWhatsapp: input.acceptsWhatsapp ?? true
      }
    });
  }

  public async listAgents() {
    const agents = await prisma.agent.findMany({
      orderBy: [{ status: "asc" }, { name: "asc" }]
    });

    const assignmentCounts = await prisma.leadAssignment.groupBy({
      by: ["agentId"],
      where: {
        status: AssignmentStatus.OPEN,
        agentId: { in: agents.map((agent) => agent.id) }
      },
      _count: {
        _all: true
      }
    });

    const countMap = new Map(
      assignmentCounts.map((row) => [row.agentId, row._count._all] as const)
    );

    return agents.map((agent) => ({
      ...agent,
      openAssignments: countMap.get(agent.id) ?? 0
    }));
  }

  public async updateAgent(agentId: string, input: UpdateAgentInput) {
    const existing = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!existing) {
      throw new AppError(404, "Agent not found");
    }

    return prisma.agent.update({
      where: { id: agentId },
      data: {
        name: input.name ?? existing.name,
        email: input.email ?? existing.email,
        phoneE164: input.phone
          ? normalizeKenyanPhoneToE164(input.phone)
          : existing.phoneE164,
        capacity: input.capacity ?? existing.capacity,
        status: input.status ?? existing.status,
        acceptsWhatsapp: input.acceptsWhatsapp ?? existing.acceptsWhatsapp
      }
    });
  }
}