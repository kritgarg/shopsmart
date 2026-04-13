import prisma from '../../config/db.js';

export const getUserPurchases = async (userId) => {
    return await prisma.purchase.findMany({
        where: { userId },
        include: { product: true }
    });
};

export const createPurchase = async (userId, productId) => {
    // Check for duplicate purchase
    const existing = await prisma.purchase.findFirst({
        where: { userId, productId }
    });

    if (existing) {
        throw new Error('Product already purchased');
    }

    // Optional: remove from cart after purchase
    await prisma.cartItem.deleteMany({
        where: { userId, productId }
    });

    return await prisma.purchase.create({ 
        data: { userId, productId } 
    });
};
