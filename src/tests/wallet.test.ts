import request from "supertest";
import app from "../app";
import db from "../config/db";

let userToken: string;
let secondUserToken: string;

beforeAll(async () => {
  await db.migrate.latest();

  // clean up before tests
  await db("transactions").delete();
  await db("wallets").delete();
  await db("users").delete();

  // create first user
  const firstUser = await request(app).post("/api/v1/users").send({
    name: "Wallet Tester",
    email: "wallettester@example.com",
    phone: "08044444444",
  });

  userToken = firstUser.body.data.token;

  // create second user
  const secondUser = await request(app).post("/api/v1/users").send({
    name: "Second Tester",
    email: "secondtester@example.com",
    phone: "08055555555",
  });

  secondUserToken = secondUser.body.data.token;

  // fund first user wallet so transfer and withdraw tests work
  await request(app)
    .post("/api/v1/wallet/fund")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ amount: 10000 });
});

afterAll(async () => {
  await db("transactions").delete();
  await db("wallets").delete();
  await db("users").delete();
  await db.destroy();
});

describe("Wallet Endpoints", () => {
  // ─── Balance Tests ────────────────────────────────────────────────────────────
  it("should get wallet balance", async () => {
    const res = await request(app)
      .get("/api/v1/wallet/balance")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(typeof res.body.data.balance).toBe("number");
  });

  it("should return 401 when no token provided", async () => {
    const res = await request(app).get("/api/v1/wallet/balance");

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("No token provided");
  });

  // ─── Fund Tests ───────────────────────────────────────────────────────────────
  it("should fund wallet successfully", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/fund")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5000 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.new_balance).toBeGreaterThan(0);
  });

  it("should not fund wallet with invalid amount", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/fund")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: -100 });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Valid amount is required");
  });

  it("should not fund wallet with missing amount", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/fund")
      .set("Authorization", `Bearer ${userToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  // ─── Transfer Tests ───────────────────────────────────────────────────────────
  it("should transfer funds successfully", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/transfer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        amount: 1000,
        recipient_email: "secondtester@example.com",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.new_balance).toBeGreaterThanOrEqual(0);
  });

  it("should not transfer with insufficient balance", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/transfer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        amount: 999999,
        recipient_email: "secondtester@example.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Insufficient balance");
  });

  it("should not transfer to non-existent user", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/transfer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        amount: 100,
        recipient_email: "nobody@example.com",
      });

    expect(res.status).toBe(404);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Recipient not found");
  });

  it("should not transfer to yourself", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/transfer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        amount: 100,
        recipient_email: "wallettester@example.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Cannot transfer to yourself");
  });

  it("should not transfer with missing recipient", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/transfer")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 100 });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  // ─── Withdraw Tests ───────────────────────────────────────────────────────────
  it("should withdraw funds successfully", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/withdraw")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 500 });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.new_balance).toBeGreaterThanOrEqual(0);
  });

  it("should not withdraw with insufficient balance", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/withdraw")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 999999 });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Insufficient balance");
  });

  it("should not withdraw with invalid amount", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/withdraw")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: -100 });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Valid amount is required");
  });

  it("should return 401 with invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/wallet/withdraw")
      .set("Authorization", "Bearer invalid-token")
      .send({ amount: 100 });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Invalid token");
  });
});