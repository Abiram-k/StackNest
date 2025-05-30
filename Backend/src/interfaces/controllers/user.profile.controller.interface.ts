import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/IAuth.js";

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
  getStatsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getInspectData(
    req: Request, 
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getFriendSuggestion(
    req: Request, 
    res: Response,
    next: NextFunction
  ): Promise<void>;
  subscribeUserForPushNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  
}
