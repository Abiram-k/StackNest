import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/IAuth";

export interface IUserProfileController {
  getUserData(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateUserProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  checkinUser(req: Request, res: Response, next: NextFunction): Promise<void>;

  getUserStreakCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getCardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getChallengePoints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
