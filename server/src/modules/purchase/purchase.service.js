import prisma from "../../config/db.js";

export const createPurchaseService = async (userId, productId) => {
  // prevent duplicate purchase
  const existing = await prisma.purchase.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    throw new Error("Product already purchased");
  }

  return await prisma.purchase.create({
    data: { userId, productId },
  });
};

export const getUserPurchasesService = async (userId) => {
  return await prisma.purchase.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
};
