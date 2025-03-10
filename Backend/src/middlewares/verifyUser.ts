import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { AuthRequest, DecodedToken } from "../types/IAuth";
import userModel from "../models/user.model";
import { AdminRespository } from "../repositories/admin.repository";
import { UserBaseRepository } from "../repositories/user.repository";

export const verifyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

  if (!process.env.JWT_SECRET) {
    res.status(500).json({
      message: "Server Error: JWT Access Secret(verify user) is missing",
    });
    return;
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
    const userBaseRepository = new UserBaseRepository();

    const user = await userBaseRepository.findById(decoded.userId as string);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (user.isBlocked) {
      throw createHttpError(403, "Access Denied: User is blocked");
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.sendStatus(401);
      // throw createHttpError(401, "Access Denied: unAuthorized");
    }
    next(error);
  }
};
