import request from 'supertest';
import app from '../src/app.js';

describe('Product API', () => {
  it('should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 404 for invalid product id', async () => {
    const res = await request(app).get('/api/products/invalid-id-that-does-not-exist');
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    const { default: prisma, pool } = await import("../src/config/db.js");
    await prisma.$disconnect();
    await pool.end();
  });
});
