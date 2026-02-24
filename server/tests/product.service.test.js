import { getAllProducts } from '../src/modules/product/product.service.js';

describe('Product Service (Unit)', () => {
  it('should fetch products without crashing', async () => {
    const products = await getAllProducts();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });

  afterAll(async () => {
    const { default: prisma, pool } = await import("../src/config/db.js");
    await prisma.$disconnect();
    await pool.end();
  });
});
