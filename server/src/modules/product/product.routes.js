import express from "express";
import {
  fetchProducts,
  fetchProduct,
} from "./product.controller.js";

const router = express.Router();

router.get("/", fetchProducts);
router.get("/:id", fetchProduct);

export default router;
