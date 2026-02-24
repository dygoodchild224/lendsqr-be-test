"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const uuid_1 = require("uuid");
const user_model_1 = require("../models/user.model");
const wallet_model_1 = require("../models/wallet.model");
const karma_service_1 = require("../services/karma.service");
const createUser = async (req, res) => {
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
        const existingUser = await user_model_1.UserModel.findByEmail(email);
        if (existingUser) {
            res.status(409).json({
                status: "error",
                message: "User with this email already exists",
            });
            return;
        }
        // check karma blacklist
        const isBlacklisted = await (0, karma_service_1.checkKarmaBlacklist)(email);
        if (isBlacklisted) {
            res.status(403).json({
                status: "error",
                message: "User is blacklisted and cannot be onboarded",
            });
            return;
        }
        // create user and wallet
        const userId = (0, uuid_1.v4)();
        const walletId = (0, uuid_1.v4)();
        const token = (0, uuid_1.v4)();
        await user_model_1.UserModel.create({
            id: userId,
            name,
            email,
            phone,
            token,
        });
        await wallet_model_1.WalletModel.create({
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
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "Internal Server Error",
        });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=user.controller.js.map