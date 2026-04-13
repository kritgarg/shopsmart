import prisma from '../../config/db.js';

export const getUserCart = async (userId) => {
    return await prisma.cartItem.findMany({
        where: { userId },
        include: { product: true }
    });
};

export const addToCart = async (userId, productId) => {
    // Unique constraint will throw if exists, but we can check or use upsert
    // User wants unique constraint prevention logic
    const existing = await prisma.cartItem.findUnique({
        where: {
            userId_productId: { userId, productId }
        }
    });

    if (existing) {
        throw new Error('Item already in cart');
    }

    return await prisma.cartItem.create({
        data: { userId, productId }
    });
};

export const removeFromCart = async (userId, productId) => {
    return await prisma.cartItem.deleteMany({
        where: { userId, productId }
    });
};
