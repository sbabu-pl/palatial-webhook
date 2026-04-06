import { Router } from "express";
import {
  createLead,
  getLead,
  handoffLead,
  listLeads,
  updateLead
} from "./leads.controller";

const router = Router();

router.get("/", listLeads);
router.post("/", createLead);
router.get("/:leadId", getLead);
router.patch("/:leadId", updateLead);
router.post("/:leadId/handoff", handoffLead);

export default router;