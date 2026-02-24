import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const user = await UserModel.findByToken(token);

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};