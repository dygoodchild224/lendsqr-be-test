import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../models/user.model";
import { WalletModel } from "../models/wallet.model";
import { checkKarmaBlacklist } from "../services/karma.service";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone } = req.body;

  try {
    // validate request body
    if (!name || !email || !phone) {
      res.status(400).json({
        status: "error",
        message: "Name, email and phone are required",
      });
      return;
    }

    // check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
      return;
    }

    // check karma blacklist
    const isBlacklisted = await checkKarmaBlacklist(email);
    if (isBlacklisted) {
      res.status(403).json({
        status: "error",
        message: "User is blacklisted and cannot be onboarded",
      });
      return;
    }

    // create user and wallet
    const userId = uuidv4();
    const walletId = uuidv4();
    const token = uuidv4();

    await UserModel.create({
      id: userId,
      name,
      email,
      phone,
      token,
    });

    await WalletModel.create({
      id: walletId,
      user_id: userId,
      balance: 0,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: { id: userId, name, email, phone },
        wallet: { id: walletId, balance: 0 },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};