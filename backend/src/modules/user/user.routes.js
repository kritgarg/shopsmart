import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.middleware.js';
import * as userController from './user.controller.js';

const router = Router();

// Publicly authenticated routes
router.get('/sync', requireAuth, userController.syncUser);
router.get('/purchases', requireAuth, userController.getPurchases);

// Only admin can view all users
router.get('/', requireAuth, requireAdmin, userController.getUsers);

// Admin can update a user's role
router.put('/:id/role', requireAuth, requireAdmin, userController.updateRole);

export default router;
