import { NextFunction, Request, Response } from "express";

export interface IAdminPremiumController {
  getAllPremium(req: Request, res: Response, next: NextFunction): Promise<void>;
  getSelectedPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addPremium(req: Request, res: Response, next: NextFunction): Promise<void>;
  updatePremium(req: Request, res: Response, next: NextFunction): Promise<void>;
  removePremium(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleListPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
