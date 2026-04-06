/*
  Warnings:

  - The `state` column on the `ChatSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assignedTo` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `productInterest` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `Lead` table. All the data in the column will be lost.
  - The `source` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[phoneE164]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'WHATSAPP', 'API', 'MANUAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CAPTURE_IN_PROGRESS', 'QUALIFIED', 'HUMAN_HANDOFF_PENDING', 'HUMAN_ASSIGNED', 'CONTACTED', 'FOLLOW_UP_REQUESTED', 'CLOSED_WON', 'CLOSED_LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MOTOR', 'LIFE', 'MEDICAL', 'POLICY_FOLLOW_UP', 'OTHER');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('ROOT_MENU', 'AWAITING_MOTOR_DETAILS', 'AWAITING_LIFE_DETAILS', 'AWAITING_MEDICAL_DETAILS', 'AWAITING_POLICY_DETAILS');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'HANDED_OFF', 'CLOSED');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LeadEventType" AS ENUM ('CREATED', 'UPDATED', 'NOTE_ADDED', 'WEBSITE_CAPTURE', 'WHATSAPP_INBOUND', 'WHATSAPP_OUTBOUND', 'HANDOFF_REQUESTED', 'HANDOFF_ASSIGNED', 'HANDOFF_UNASSIGNED', 'STATUS_CHANGED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('SYSTEM', 'CUSTOMER', 'AGENT', 'API');

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_waId_fkey";

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "state",
ADD COLUMN     "state" "SessionState" NOT NULL DEFAULT 'ROOT_MENU';

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "assignedTo",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "productInterest",
DROP COLUMN "stage",
ADD COLUMN     "currentAgentId" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "phoneE164" TEXT,
ADD COLUMN     "priority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "productType" "ProductType",
ADD COLUMN     "sourcePage" TEXT,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ALTER COLUMN "waId" DROP NOT NULL,
DROP COLUMN "source",
ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'WHATSAPP';

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneE164" TEXT,
    "status" "AgentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "capacity" INTEGER NOT NULL DEFAULT 20,
    "acceptsWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAssignment" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT,
    "metadata" JSONB,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "LeadAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "LeadEventType" NOT NULL,
    "actorType" "ActorType" NOT NULL DEFAULT 'SYSTEM',
    "actorId" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE INDEX "LeadAssignment_leadId_status_idx" ON "LeadAssignment"("leadId", "status");

-- CreateIndex
CREATE INDEX "LeadAssignment_agentId_status_idx" ON "LeadAssignment"("agentId", "status");

-- CreateIndex
CREATE INDEX "LeadEvent_leadId_createdAt_idx" ON "LeadEvent"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "LeadEvent_type_idx" ON "LeadEvent"("type");

-- CreateIndex
CREATE INDEX "ChatSession_leadId_idx" ON "ChatSession"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_phoneE164_key" ON "Lead"("phoneE164");

-- CreateIndex
CREATE INDEX "Lead_status_productType_idx" ON "Lead"("status", "productType");

-- CreateIndex
CREATE INDEX "Lead_currentAgentId_idx" ON "Lead"("currentAgentId");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "ProcessedMessage_waId_idx" ON "ProcessedMessage"("waId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_currentAgentId_fkey" FOREIGN KEY ("currentAgentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadAssignment" ADD CONSTRAINT "LeadAssignment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadAssignment" ADD CONSTRAINT "LeadAssignment_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
