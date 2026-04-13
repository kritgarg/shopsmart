import express from 'express';
import * as purchaseController from './purchase.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/my', purchaseController.getUserPurchases);
router.post('/', purchaseController.createPurchase);

export default router;
