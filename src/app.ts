import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";

dotenv.config();

const app: Application = express();

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Demo Credit Wallet Service is running",
    version: "1.0.0",
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wallet", walletRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;