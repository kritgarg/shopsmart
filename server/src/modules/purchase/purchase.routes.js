import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { createPurchase, getMyPurchases } from "./purchase.controller.js";

const router = express.Router();

router.post("/", requireAuth, createPurchase);
router.get("/my", requireAuth, getMyPurchases);

// Temp test route to verify auth is working
router.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated ✅",
    user: req.user,
  });
});

export default router;
