"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../config/db"));
beforeAll(async () => {
    await db_1.default.migrate.latest();
});
afterAll(async () => {
    await (0, db_1.default)("transactions").delete();
    await (0, db_1.default)("wallets").delete();
    await (0, db_1.default)("users").delete();
    await db_1.default.destroy();
});
describe("User Endpoints", () => {
    // ─── Positive Tests ───────────────────────────────────────────────────────────
    it("should create a new user successfully", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
            name: "Test User",
            email: "testuser@example.com",
            phone: "08011111111",
        });
        expect(res.status).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data.user.email).toBe("testuser@example.com");
        expect(res.body.data.token).toBeDefined();
        expect(res.body.data.wallet.balance).toBe(0);
    });
    // ─── Negative Tests ───────────────────────────────────────────────────────────
    it("should not create user with missing fields", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
            name: "Test User",
        });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Name, email and phone are required");
    });
    it("should not create duplicate user with same email", async () => {
        await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
            name: "Duplicate User",
            email: "duplicate@example.com",
            phone: "08022222222",
        });
        const res = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
            name: "Duplicate User",
            email: "duplicate@example.com",
            phone: "08022222222",
        });
        expect(res.status).toBe(409);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("User with this email already exists");
    });
    it("should not onboard a blacklisted user", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/api/v1/users").send({
            name: "Blacklisted User",
            email: "blacklisted@example.com",
            phone: "08033333333",
        });
        expect(res.status).toBe(403);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("User is blacklisted and cannot be onboarded");
    });
});
//# sourceMappingURL=user.test.js.map