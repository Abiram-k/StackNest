import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const verifyAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user ||req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins Only" });
  }
  next();
};

