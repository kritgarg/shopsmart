import express from 'express';
import cors from 'cors';
import productRoutes from './modules/product/product.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

export default app;
