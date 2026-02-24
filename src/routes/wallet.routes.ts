import { Router } from "express";
import { fundWallet, transferFunds, withdrawFunds, getBalance } from "../controllers/wallet.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/balance", getBalance);
router.post("/fund", fundWallet);
router.post("/transfer", transferFunds);
router.post("/withdraw", withdrawFunds);

export default router;