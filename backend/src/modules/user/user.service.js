import prisma from '../../config/db.js';

export const findUserById = async (id) => {
    return await prisma.user.findUnique({ where: { id } });
};

export const createUser = async (id, email, role = 'USER') => {
    return await prisma.user.create({
        data: { id, email, role }
    });
};

export const updateUserRole = async (id, role) => {
    return await prisma.user.update({
        where: { id },
        data: { role }
    });
};
