import { Router } from "express";
import { receiveWebhook, verifyWebhook } from "./whatsapp.controller";

const router = Router();

router.get("/", verifyWebhook);
router.post("/", receiveWebhook);

export default router;