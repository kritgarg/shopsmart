import express from "express";
import {
  fetchProducts,
  fetchProduct,
} from "./product.controller.js";
import prisma from "../../config/db.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", fetchProduct);

// ⚠️ TEST-ONLY route — for seeding products during integration tests
router.post("/products-test", async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
