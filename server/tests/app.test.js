import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    afterAll(async () => {
        const { default: prisma, pool } = await import("../src/config/db.js");
        await prisma.$disconnect();
        await pool.end();
    });
});
