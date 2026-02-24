"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalance = exports.withdrawFunds = exports.transferFunds = exports.fundWallet = void 0;
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../config/db"));
const wallet_model_1 = require("../models/wallet.model");
const user_model_1 = require("../models/user.model");
const fundWallet = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        res.status(400).json({ status: "error", message: "Valid amount is required" });
        return;
    }
    try {
        const wallet = await wallet_model_1.WalletModel.findByUserId(req.user.id);
        if (!wallet) {
            res.status(404).json({ status: "error", message: "Wallet not found" });
            return;
        }
        await db_1.default.transaction(async (trx) => {
            const newBalance = Number(wallet.balance) + Number(amount);
            await trx("wallets").where({ id: wallet.id }).update({ balance: newBalance });
            await trx("transactions").insert({
                id: (0, uuid_1.v4)(),
                sender_wallet_id: null,
                receiver_wallet_id: wallet.id,
                amount,
                type: "fund",
            });
        });
        res.status(200).json({
            status: "success",
            message: "Wallet funded successfully",
            data: { new_balance: Number(wallet.balance) + Number(amount) },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.fundWallet = fundWallet;
const transferFunds = async (req, res) => {
    const { amount, recipient_email } = req.body;
    if (!amount || amount <= 0 || !recipient_email) {
        res.status(400).json({ status: "error", message: "Valid amount and recipient email are required" });
        return;
    }
    try {
        const senderWallet = await wallet_model_1.WalletModel.findByUserId(req.user.id);
        if (!senderWallet) {
            res.status(404).json({ status: "error", message: "Sender wallet not found" });
            return;
        }
        if (Number(senderWallet.balance) < Number(amount)) {
            res.status(400).json({ status: "error", message: "Insufficient balance" });
            return;
        }
        const recipient = await user_model_1.UserModel.findByEmail(recipient_email);
        if (!recipient) {
            res.status(404).json({ status: "error", message: "Recipient not found" });
            return;
        }
        if (recipient.id === req.user.id) {
            res.status(400).json({ status: "error", message: "Cannot transfer to yourself" });
            return;
        }
        const recipientWallet = await wallet_model_1.WalletModel.findByUserId(recipient.id);
        if (!recipientWallet) {
            res.status(404).json({ status: "error", message: "Recipient wallet not found" });
            return;
        }
        await db_1.default.transaction(async (trx) => {
            await trx("wallets").where({ id: senderWallet.id }).update({
                balance: Number(senderWallet.balance) - Number(amount),
            });
            await trx("wallets").where({ id: recipientWallet.id }).update({
                balance: Number(recipientWallet.balance) + Number(amount),
            });
            await trx("transactions").insert({
                id: (0, uuid_1.v4)(),
                sender_wallet_id: senderWallet.id,
                receiver_wallet_id: recipientWallet.id,
                amount,
                type: "transfer",
            });
        });
        res.status(200).json({
            status: "success",
            message: "Transfer successful",
            data: {
                new_balance: Number(senderWallet.balance) - Number(amount),
            },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.transferFunds = transferFunds;
const withdrawFunds = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        res.status(400).json({ status: "error", message: "Valid amount is required" });
        return;
    }
    try {
        const wallet = await wallet_model_1.WalletModel.findByUserId(req.user.id);
        if (!wallet) {
            res.status(404).json({ status: "error", message: "Wallet not found" });
            return;
        }
        if (Number(wallet.balance) < Number(amount)) {
            res.status(400).json({ status: "error", message: "Insufficient balance" });
            return;
        }
        await db_1.default.transaction(async (trx) => {
            await trx("wallets").where({ id: wallet.id }).update({
                balance: Number(wallet.balance) - Number(amount),
            });
            await trx("transactions").insert({
                id: (0, uuid_1.v4)(),
                sender_wallet_id: wallet.id,
                receiver_wallet_id: wallet.id,
                amount,
                type: "withdraw",
            });
        });
        res.status(200).json({
            status: "success",
            message: "Withdrawal successful",
            data: {
                new_balance: Number(wallet.balance) - Number(amount),
            },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.withdrawFunds = withdrawFunds;
const getBalance = async (req, res) => {
    try {
        const wallet = await wallet_model_1.WalletModel.findByUserId(req.user.id);
        if (!wallet) {
            res.status(404).json({ status: "error", message: "Wallet not found" });
            return;
        }
        res.status(200).json({
            status: "success",
            data: { balance: Number(wallet.balance) },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getBalance = getBalance;
//# sourceMappingURL=wallet.controller.js.map