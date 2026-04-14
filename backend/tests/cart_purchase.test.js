import request from 'supertest';
import app from '../src/app.js';
import prisma, { pool } from '../src/config/db.js';

describe('Cart and Purchase Integration Tests', () => {
    const userId = 'user_789';
    let productId;

    beforeAll(async () => {
        // Setup initial product for testing purposes
        const product = await prisma.product.create({
            data: {
                title: 'Cart Test Product',
                description: 'Test cart description',
                price: 10,
                notionLink: 'https://notion.so/cart'
            }
        });
        productId = product.id;
    });

    afterAll(async () => {
        await prisma.purchase.deleteMany();
        await prisma.cartItem.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
        await pool.end();
    });

    describe('Cart operations', () => {
        it('should add to cart', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId)
                .send({ productId });
            
            expect(res.status).toBe(201);
            expect(res.body.productId).toBe(productId);
        });

        it('should prevent duplicate cart items', async () => {
            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId)
                .send({ productId });
            
            expect(res.status).toBe(409);
            expect(res.body.message).toBe('Item already in cart');
        });

        it('should get cart items for user', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });

    describe('Purchase operations', () => {
        it('should be able to purchase a product', async () => {
            const res = await request(app)
                .post('/api/purchase')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId)
                .send({ productId });
            
            expect(res.status).toBe(201);
            expect(res.body.productId).toBe(productId);
        });

        it('should prevent duplicate purchases', async () => {
            const res = await request(app)
                .post('/api/purchase')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId)
                .send({ productId });
            
            expect(res.status).toBe(409);
            expect(res.body.message).toBe('Product already purchased');
        });

        it('should fetch user purchases', async () => {
            const res = await request(app)
                .get('/api/purchase/my')
                .set('Authorization', 'Bearer dummy')
                .set('x-test-user-id', userId);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
        });
    });
});
