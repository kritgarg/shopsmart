import express from 'express';
import * as productController from './product.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.post('/', requireAuth, requireAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

export default router;
