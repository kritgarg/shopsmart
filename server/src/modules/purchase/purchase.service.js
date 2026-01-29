import prisma from "../../config/db.js";

export const createPurchaseService = async (userId, productId) => {
  return await prisma.purchase.create({
    data: {
      userId,
      productId,
    },
  });
};

export const getUserPurchasesService = async (userId) => {
  return await prisma.purchase.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
