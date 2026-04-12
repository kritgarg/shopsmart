import * as productService from './product.service.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, notionLink } = req.body;
        if (!title || !description || !price || !notionLink) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const imageUrl = req.file ? req.file.path : null;
        
        const product = await productService.createProduct({
            title,
            description,
            price: parseInt(price),
            imageUrl,
            notionLink
        });
        
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, notionLink } = req.body;
        const imageUrl = req.file ? req.file.path : undefined;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price) updateData.price = parseInt(price);
        if (notionLink) updateData.notionLink = notionLink;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        const product = await productService.updateProduct(req.params.id, updateData);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
