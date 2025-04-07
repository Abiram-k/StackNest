import { NextFunction, Request, Response } from "express";

export interface IAdminRewardController {
  addReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  getActiveReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSelectedReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateReward(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleListing(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeReward(req: Request, res: Response, next: NextFunction): Promise<void>;
}
