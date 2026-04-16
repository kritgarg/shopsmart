import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import productRoutes from './modules/product/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import purchaseRoutes from './modules/purchase/purchase.routes.js';
import userRoutes from './modules/user/user.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service API');
});

// Error handling middleware
app.use((err, req, res, _next) => {
  res.status(500).json({ 
    message: 'Something broke!', 
    error: process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

export default app;
