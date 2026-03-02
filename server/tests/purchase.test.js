import { jest, describe, it, expect, beforeAll, afterAll } from "@jest/globals";

// In ESM + jest, mocks must be set up BEFORE importing the module
// using jest.unstable_mockModule
jest.unstable_mockModule("../src/middleware/auth.middleware.js", () => ({
  requireAuth: (req, res, next) => {
    req.user = { userId: "test-user-jest" };
    next();
  },
}));

// Dynamic import AFTER mock is registered
const { default: app } = await import("../src/app.js");
const { default: request } = await import("supertest");

describe("Purchase API", () => {
  let productId;

  beforeAll(async () => {
    // Create a real product in DB to use as test fixture
    const res = await request(app)
      .post("/api/products/products-test")
      .send({
        title: "Jest Test Product",
        description: "Created during test suite",
        price: 99,
        category: "Test",
        notionLink: "https://notion.so/jest-test",
        isFree: false,
      });

    productId = res.body.id;
  });

  it("should create a purchase (201)", async () => {
    const res = await request(app)
      .post("/api/purchase")
      .send({ productId });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("purchase");
    expect(res.body.purchase.userId).toBe("test-user-jest");
  });

  it("should not allow duplicate purchase (400)", async () => {
    const res = await request(app)
      .post("/api/purchase")
      .send({ productId });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Product already purchased");
  });

  it("should fetch user purchases (200)", async () => {
    const res = await request(app).get("/api/purchase/my");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return 400 if productId is missing", async () => {
    const res = await request(app)
      .post("/api/purchase")
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Product ID required");
  });

  afterAll(async () => {
    const { default: prisma, pool } = await import("../src/config/db.js");
    await prisma.$disconnect();
    await pool.end();
  });
});
