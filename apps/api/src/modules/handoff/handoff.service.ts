import {
  ActorType,
  AgentStatus,
  AssignmentStatus,
  LeadEventType,
  LeadStatus,
  Prisma
} from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/app-error";

type Tx = Prisma.TransactionClient;

export class HandoffService {
  public async handoffLead(input: {
    leadId: string;
    reason?: string;
    preferredAgentId?: string;
    forceReassign?: boolean;
  }) {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: input.leadId },
        include: {
          assignments: {
            where: { status: AssignmentStatus.OPEN },
            include: { agent: true },
            orderBy: { assignedAt: "desc" }
          }
        }
      });

      if (!lead) {
        throw new AppError(404, "Lead not found");
      }

      const currentOpenAssignment = lead.assignments[0];

      if (currentOpenAssignment && !input.forceReassign) {
        return {
          status: "ASSIGNED" as const,
          assignmentId: currentOpenAssignment.id,
          agent: currentOpenAssignment.agent
        };
      }

      if (input.forceReassign && lead.assignments.length > 0) {
        await tx.leadAssignment.updateMany({
          where: {
            leadId: input.leadId,
            status: AssignmentStatus.OPEN
          },
          data: {
            status: AssignmentStatus.CLOSED,
            closedAt: new Date()
          }
        });
      }

      await tx.leadEvent.create({
        data: {
          leadId: input.leadId,
          type: LeadEventType.HANDOFF_REQUESTED,
          actorType: ActorType.SYSTEM,
          message: input.reason ?? "Human handoff requested"
        }
      });

      const agent = input.preferredAgentId
        ? await this.getPreferredAgent(tx, input.preferredAgentId)
        : await this.pickBestAgent(tx);

      if (!agent) {
        await tx.lead.update({
          where: { id: input.leadId },
          data: {
            status: LeadStatus.HUMAN_HANDOFF_PENDING,
            currentAgentId: null
          }
        });

        await tx.leadEvent.create({
          data: {
            leadId: input.leadId,
            type: LeadEventType.HANDOFF_UNASSIGNED,
            actorType: ActorType.SYSTEM,
            message: "No available agent found"
          }
        });

        return {
          status: "QUEUED" as const
        };
      }

      const assignment = await tx.leadAssignment.create({
        data: {
          leadId: input.leadId,
          agentId: agent.id,
          reason: input.reason,
          status: AssignmentStatus.OPEN
        }
      });

      await tx.lead.update({
        where: { id: input.leadId },
        data: {
          status: LeadStatus.HUMAN_ASSIGNED,
          currentAgentId: agent.id
        }
      });

      await tx.leadEvent.create({
        data: {
          leadId: input.leadId,
          type: LeadEventType.HANDOFF_ASSIGNED,
          actorType: ActorType.SYSTEM,
          message: `Lead assigned to ${agent.name}`,
          metadata: {
            agentId: agent.id,
            assignmentId: assignment.id
          }
        }
      });

      return {
        status: "ASSIGNED" as const,
        assignmentId: assignment.id,
        agent
      };
    });
  }

  private async getPreferredAgent(tx: Tx, agentId: string) {
    const agent = await tx.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      throw new AppError(404, "Preferred agent not found");
    }

    if (!agent.acceptsWhatsapp || agent.status === AgentStatus.OFFLINE) {
      throw new AppError(409, "Preferred agent is not available for WhatsApp handoff");
    }

    return agent;
  }

  private async pickBestAgent(tx: Tx) {
    const agents = await tx.agent.findMany({
      where: {
        acceptsWhatsapp: true,
        status: AgentStatus.AVAILABLE
      },
      orderBy: { updatedAt: "asc" }
    });

    if (!agents.length) {
      return null;
    }

    const counts = await tx.leadAssignment.groupBy({
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
      counts.map((row) => [row.agentId, row._count._all] as const)
    );

    const eligible = agents
      .map((agent) => ({
        ...agent,
        openAssignments: countMap.get(agent.id) ?? 0
      }))
      .filter((agent) => agent.openAssignments < agent.capacity)
      .sort(
        (a, b) =>
          a.openAssignments - b.openAssignments ||
          a.updatedAt.getTime() - b.updatedAt.getTime()
      );

    return eligible[0] ?? null;
  }
}