"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/balance", wallet_controller_1.getBalance);
router.post("/fund", wallet_controller_1.fundWallet);
router.post("/transfer", wallet_controller_1.transferFunds);
router.post("/withdraw", wallet_controller_1.withdrawFunds);
exports.default = router;
//# sourceMappingURL=wallet.routes.js.map