import request from 'supertest';
import app from '../src/app.js';
import prisma, { pool } from '../src/config/db.js';

describe('Product Integration Tests', () => {
    const adminId = 'admin_123';
    const userId = 'user_456';

    beforeAll(async () => {
        // Cleanup or init could go here
    });

    afterAll(async () => {
        await prisma.purchase.deleteMany();
        await prisma.cartItem.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
        await pool.end();
    });

    it('should get all products (initially empty)', async () => {
        const res = await request(app).get('/api/products');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('admin should be able to create a product', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer dummy_token')
            .set('x-test-user-id', adminId)
            .set('x-test-role', 'ADMIN')
            .send({
                title: 'Test Product',
                description: 'A test description',
                price: 15,
                notionLink: 'https://notion.so/test'
            });
        
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Test Product');
    });

    it('non-admin should be blocked from creating products', async () => {
        const res = await request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer dummy_token')
            .set('x-test-user-id', userId)
            .set('x-test-role', 'USER')
            .send({
                title: 'Forbidden Product',
                description: 'No admin access',
                price: 15,
                notionLink: 'https://notion.so/test'
            });
        
        expect(res.status).toBe(403);
    });

    it('should get a single product by ID', async () => {
        const product = await prisma.product.findFirst();
        const res = await request(app).get(`/api/products/${product.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(product.id);
    });
});
