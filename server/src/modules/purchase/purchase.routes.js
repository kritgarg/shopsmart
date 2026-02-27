import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { createPurchase, getMyPurchases } from "./purchase.controller.js";

const router = express.Router();

router.post("/", requireAuth, createPurchase);
router.get("/my", requireAuth, getMyPurchases);

export default router;
