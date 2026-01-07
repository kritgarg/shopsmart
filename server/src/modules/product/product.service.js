import prisma from "../../config/db.js";

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};
