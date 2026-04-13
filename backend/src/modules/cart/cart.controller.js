import * as cartService from './cart.service.js';

export const getUserCart = async (req, res) => {
    try {
        const cartItems = await cartService.getUserCart(req.user.id);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID required' });

        const cartItem = await cartService.addToCart(req.user.id, productId);
        res.status(201).json(cartItem);
    } catch (error) {
        if (error.message === 'Item already in cart') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        await cartService.removeFromCart(req.user.id, productId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};
