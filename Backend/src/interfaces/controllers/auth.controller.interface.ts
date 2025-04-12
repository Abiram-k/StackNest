import { Request, Response, NextFunction } from "express";

export interface IAuthController {
  
  githubCallback(req: Request, res: Response): Promise<void>;

  validateGithubToken(req:Request, res:Response,next:NextFunction):Promise<void>;

  googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>;

  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  generateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  logout(
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

  uploadToSignedCloudinary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
