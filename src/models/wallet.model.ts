import db from "../config/db";
import { Wallet } from "../types";

export const WalletModel = {
  async create(wallet: Wallet): Promise<void> {
    await db("wallets").insert(wallet);
  },

  async findByUserId(user_id: string): Promise<Wallet | undefined> {
    return db("wallets").where({ user_id }).first();
  },

  async findById(id: string): Promise<Wallet | undefined> {
    return db("wallets").where({ id }).first();
  },

  async updateBalance(id: string, balance: number): Promise<void> {
    await db("wallets").where({ id }).update({ balance });
  },
};