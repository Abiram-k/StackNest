import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import createHttpError from 'http-errors'
import { AuthRequest, DecodedToken } from "../types/IAuth";

export const verifyUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {

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

    req.user = {
      userId:decoded.userId,
      role:decoded.role
    };

    next();
  } catch (error) {
    // res.status(403).json({ message: "Invalid token" });
    throw createHttpError(401, "Unauthurized")
    // next(error);
  }
};

// export default authMiddleware;
