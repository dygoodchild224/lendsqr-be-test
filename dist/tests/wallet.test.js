"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../config/db"));
let userToken;
let secondUserToken;
beforeAll(async () => {
    await db_1.default.migrate.latest();
    // clean up before tests
    await (0, db_1.default)("transactions").delete();
    await (0, db_1.default)("wallets").delete();
    await (0, db_1.default)("users").delete();
    // create first user
    const firstUser = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
        name: "Wallet Tester",
        email: "wallettester@example.com",
        phone: "08044444444",
    });
    userToken = firstUser.body.data.token;
    // create second user
    const secondUser = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
        name: "Second Tester",
        email: "secondtester@example.com",
        phone: "08055555555",
    });
    secondUserToken = secondUser.body.data.token;
    // fund first user wallet so transfer and withdraw tests work
    await (0, supertest_1.default)(app_1.default)
        .post("/api/v1/wallet/fund")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ amount: 10000 });
});
afterAll(async () => {
    await (0, db_1.default)("transactions").delete();
    await (0, db_1.default)("wallets").delete();
    await (0, db_1.default)("users").delete();
    await db_1.default.destroy();
});
describe("Wallet Endpoints", () => {
    // ─── Balance Tests ────────────────────────────────────────────────────────────
    it("should get wallet balance", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get("/api/v1/wallet/balance")
            .set("Authorization", `Bearer ${userToken}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(typeof res.body.data.balance).toBe("number");
    });
    it("should return 401 when no token provided", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/api/v1/wallet/balance");
        expect(res.status).toBe(401);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("No token provided");
    });
    // ─── Fund Tests ───────────────────────────────────────────────────────────────
    it("should fund wallet successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: 5000 });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.new_balance).toBeGreaterThan(0);
    });
    it("should not fund wallet with invalid amount", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: -100 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Valid amount is required");
    });
    it("should not fund wallet with missing amount", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/fund")
            .set("Authorization", `Bearer ${userToken}`)
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
    });
    // ─── Transfer Tests ───────────────────────────────────────────────────────────
    it("should transfer funds successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
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
        const res = await (0, supertest_1.default)(app_1.default)
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
        const res = await (0, supertest_1.default)(app_1.default)
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
        const res = await (0, supertest_1.default)(app_1.default)
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
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/transfer")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: 100 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
    });
    // ─── Withdraw Tests ───────────────────────────────────────────────────────────
    it("should withdraw funds successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: 500 });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.new_balance).toBeGreaterThanOrEqual(0);
    });
    it("should not withdraw with insufficient balance", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: 999999 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Insufficient balance");
    });
    it("should not withdraw with invalid amount", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", `Bearer ${userToken}`)
            .send({ amount: -100 });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Valid amount is required");
    });
    it("should return 401 with invalid token", async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/wallet/withdraw")
            .set("Authorization", "Bearer invalid-token")
            .send({ amount: 100 });
        expect(res.status).toBe(401);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Invalid token");
    });
});
//# sourceMappingURL=wallet.test.js.map