import type { Request, Response } from "express";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { isValidMetaSignature } from "./whatsapp.signature";
import { WhatsAppService } from "./whatsapp.service";
import type { WhatsAppWebhookPayload } from "./whatsapp.types";

const whatsappService = new WhatsAppService();

export async function verifyWebhook(req: Request, res: Response): Promise<void> {
  const mode = req.query["hub.mode"];
  const verifyToken = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    verifyToken === env.WHATSAPP_VERIFY_TOKEN &&
    typeof challenge === "string"
  ) {
    logger.info("WhatsApp webhook verified");
    res.status(200).send(challenge);
    return;
  }

  logger.warn("WhatsApp webhook verification failed");
  res.sendStatus(403);
}

export async function receiveWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.header("x-hub-signature-256");

  const validSignature = isValidMetaSignature(req.rawBody, signature, env.META_APP_SECRET);

  if (!validSignature) {
    logger.warn("Invalid Meta webhook signature");
    res.sendStatus(401);
    return;
  }

  res.sendStatus(200);

  void whatsappService.handleWebhookPayload(req.body as WhatsAppWebhookPayload).catch((error) => {
    logger.error({ err: error }, "Asynchronous WhatsApp webhook processing failed");
  });
}