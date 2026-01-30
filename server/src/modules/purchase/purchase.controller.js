import {
  createPurchaseService,
  getUserPurchasesService,
} from "./purchase.service.js";

export const createPurchase = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID required" });
    }

    const purchase = await createPurchaseService(userId, productId);

    res.json({
      message: "Purchase successful",
      purchase,
    });
  } catch (error) {
    console.error("createPurchase error:", error);
    res.status(500).json({ error: "Purchase failed", details: error?.message });
  }
};

export const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.userId;
    const purchases = await getUserPurchasesService(userId);
    res.json(purchases);
  } catch (error) {
    console.error("getMyPurchases error:", error);
    res.status(500).json({ error: "Failed to fetch purchases", details: error?.message });
  }
};
