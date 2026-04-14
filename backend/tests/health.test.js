import request from 'supertest';
import app from '../src/app.js';
import prisma, { pool } from '../src/config/db.js';

describe('Health Check', () => {
    afterAll(async () => {
        await prisma.$disconnect();
        await pool.end();
    });

    it('should return 200 OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
