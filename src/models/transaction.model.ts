import db from "../config/db";
import { Transaction } from "../types";

export const TransactionModel = {
  async create(transaction: Transaction): Promise<void> {
    await db("transactions").insert(transaction);
  },

  async findByWalletId(wallet_id: string): Promise<Transaction[]> {
    return db("transactions")
      .where("sender_wallet_id", wallet_id)
      .orWhere("receiver_wallet_id", wallet_id)
      .orderBy("created_at", "desc");
  },
};