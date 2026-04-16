import * as userService from './user.service.js';
import prisma from '../../config/db.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const syncUser = async (req, res, next) => {
    try {
        // middleware already handled the sync logic!
        // req.user now contains the DB user
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
};

export const getPurchases = async (req, res, next) => {
    try {
        const purchases = await prisma.purchase.findMany({
            where: { userId: req.user.id },
            include: { product: true }
        });
        res.status(200).json(purchases.map(p => p.product));
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (!['USER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await userService.updateUserRole(id, role);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
