"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const user_model_1 = require("../models/user.model");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                status: "error",
                message: "No token provided",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const user = await user_model_1.UserModel.findByToken(token);
        if (!user) {
            res.status(401).json({
                status: "error",
                message: "Invalid token",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "Internal Server Error",
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map