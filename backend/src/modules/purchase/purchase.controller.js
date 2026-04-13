import * as purchaseService from './purchase.service.js';

export const getUserPurchases = async (req, res) => {
    try {
        const purchases = await purchaseService.getUserPurchases(req.user.id);
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};

export const createPurchase = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID required' });
        }

        const purchase = await purchaseService.createPurchase(req.user.id, productId);
        res.status(201).json(purchase);
    } catch (error) {
        if (error.message === 'Product already purchased') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error processing purchase', error: error.message });
    }
};
