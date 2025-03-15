import { Request, Response, NextFunction } from "express";

export interface IBannerController {
  addNewBanner(req: Request, res: Response, next: NextFunction): Promise<void>;
  fetchBanners(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  removeBanner(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateBanner(req: Request, res: Response, next: NextFunction): Promise<void>;
}
