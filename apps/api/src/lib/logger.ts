import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: "palatial-api",
    env: env.NODE_ENV
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "accessToken",
      "body.whatsapp_access_token"
    ],
    censor: "[REDACTED]"
  }
});