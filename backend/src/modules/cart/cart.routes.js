import express from 'express';
import * as cartController from './cart.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', cartController.getUserCart);
router.post('/', cartController.addToCart);
router.delete('/:productId', cartController.removeFromCart);

export default router;
