import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/enum.statusCode";
interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;
  if (!authReq.user || authReq.user.role !== "admin") {
    console.log("Access Denied: No Authrization ");
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Access Denied: No Authrization" });
    return;
  }
  next();
};
