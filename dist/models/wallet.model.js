"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.WalletModel = {
    async create(wallet) {
        await (0, db_1.default)("wallets").insert(wallet);
    },
    async findByUserId(user_id) {
        return (0, db_1.default)("wallets").where({ user_id }).first();
    },
    async findById(id) {
        return (0, db_1.default)("wallets").where({ id }).first();
    },
    async updateBalance(id, balance) {
        await (0, db_1.default)("wallets").where({ id }).update({ balance });
    },
};
//# sourceMappingURL=wallet.model.js.map