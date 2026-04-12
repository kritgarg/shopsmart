import prisma from '../../config/db.js';

export const getAllProducts = async () => {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

export const getProductById = async (id) => {
    return await prisma.product.findUnique({
        where: { id }
    });
};

export const createProduct = async (data) => {
    return await prisma.product.create({
        data
    });
};

export const updateProduct = async (id, data) => {
    return await prisma.product.update({
        where: { id },
        data
    });
};

export const deleteProduct = async (id) => {
    return await prisma.product.delete({
        where: { id }
    });
};
