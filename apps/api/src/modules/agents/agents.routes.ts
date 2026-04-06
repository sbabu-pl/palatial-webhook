import { Router } from "express";
import { createAgent, listAgents, updateAgent } from "./agents.controller";

const router = Router();

router.get("/", listAgents);
router.post("/", createAgent);
router.patch("/:agentId", updateAgent);

export default router;