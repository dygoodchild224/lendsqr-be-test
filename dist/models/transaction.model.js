"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.TransactionModel = {
    async create(transaction) {
        await (0, db_1.default)("transactions").insert(transaction);
    },
    async findByWalletId(wallet_id) {
        return (0, db_1.default)("transactions")
            .where("sender_wallet_id", wallet_id)
            .orWhere("receiver_wallet_id", wallet_id)
            .orderBy("created_at", "desc");
    },
};
//# sourceMappingURL=transaction.model.js.map