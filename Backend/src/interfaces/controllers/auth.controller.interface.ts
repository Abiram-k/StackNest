import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>;

  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  generateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  initiateRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  register(req: Request, res: Response, next: NextFunction): Promise<void>;

  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
