import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const provided = req.header("x-api-key");

  if (!provided) {
    res.status(401).json({
      success: false,
      message: "Missing API key"
    });
    return;
  }

  const expectedBuffer = Buffer.from(env.INTERNAL_API_KEY);
  const providedBuffer = Buffer.from(provided);

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    res.status(401).json({
      success: false,
      message: "Invalid API key"
    });
    return;
  }

  next();
}