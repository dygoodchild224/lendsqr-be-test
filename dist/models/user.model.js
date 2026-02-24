"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.UserModel = {
    async create(user) {
        await (0, db_1.default)("users").insert(user);
    },
    async findByEmail(email) {
        return (0, db_1.default)("users").where({ email }).first();
    },
    async findByToken(token) {
        return (0, db_1.default)("users").where({ token }).first();
    },
    async findById(id) {
        return (0, db_1.default)("users").where({ id }).first();
    },
};
//# sourceMappingURL=user.model.js.map