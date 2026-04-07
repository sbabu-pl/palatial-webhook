declare global {
  namespace Express {
    interface Request {
      rawBody?: string;
    }
  }
}

import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { requireApiKey } from "./middleware/api-key";
import whatsappRouter from "./modules/whatsapp/whatsapp.routes";
import leadsRouter from "./modules/leads/leads.routes";
import agentsRouter from "./modules/agents/agents.routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  import cors from "cors"; // Add this import at the top

// ... inside createApp()
const app = express();
app.disable("x-powered-by");

// ADD THIS LINE HERE:
app.use(cors()); 

app.use(pinoHttp({ logger }));
// ... rest of your code

  app.use(
    pinoHttp({
      logger
    })
  );

  app.use(helmet());

  app.use(
    express.json({
      limit: "1mb",
      verify: (req, _res, buf) => {
        // This captures the raw body needed for WhatsApp signature verification
        req.rawBody = buf.toString("utf8");
      }
    })
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      service: "palatial-api",
      status: "ok"
    });
  });

  app.use("/webhooks/whatsapp", whatsappRouter);

  app.use("/api/leads", requireApiKey, leadsRouter);
  app.use("/api/agents", requireApiKey, agentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}