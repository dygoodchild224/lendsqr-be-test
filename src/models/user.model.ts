import db from "../config/db";
import { User } from "../types";

export const UserModel = {
  async create(user: User): Promise<void> {
    await db("users").insert(user);
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return db("users").where({ email }).first();
  },

  async findByToken(token: string): Promise<User | undefined> {
    return db("users").where({ token }).first();
  },

  async findById(id: string): Promise<User | undefined> {
    return db("users").where({ id }).first();
  },
};