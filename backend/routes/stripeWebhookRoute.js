// routes/stripeWebhookRoute.js

import express from "express";
import { stripeWebhookController } from "../controllers/stripeWebhookController.js";

const router = express.Router();

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookController
);

export default router;