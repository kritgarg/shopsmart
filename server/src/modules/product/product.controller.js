import {
  getAllProducts,
  getProductById,
} from "./product.service.js";

export const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("fetchProducts error:", error);
    res.status(500).json({ error: "Failed to fetch products", details: error?.message });
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("fetchProduct error:", error);
    res.status(500).json({ error: "Failed to fetch product", details: error?.message });
  }
};
