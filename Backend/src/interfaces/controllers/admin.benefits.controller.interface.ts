import { NextFunction, Request, Response } from "express";

export interface IAdminBenefitController {
  addBenefits(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getActiveBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSelectedBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  toggleListing(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
