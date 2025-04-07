import { NextFunction, Request, Response } from "express";

export interface IUserRewardController {
  getActiveReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  claimReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getclaimedRewards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
