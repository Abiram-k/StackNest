import { NextFunction, Request, Response } from "express";
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
  console.log(authReq.user);
  if (!authReq.user || authReq.user.role !== "admin") {
    console.log("Access Denied: No Authrization ");
    res.status(403).json({ message: "Access Denied: No Authrization Only" });
    return;
  }
  next();
};
