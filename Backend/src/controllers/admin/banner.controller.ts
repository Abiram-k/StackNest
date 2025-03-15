import { Request, Response, NextFunction } from "express";
import { IBannerController } from "../../interfaces/controllers/banner.controller.interface";
import { IBannerService } from "../../interfaces/services/banner.service.interface";

export class BannerController implements IBannerController {
  private _bannerService: IBannerService;
  constructor(bannerService: IBannerService) {
    this._bannerService = bannerService;
  }
  
  async addNewBanner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
  async fetchBanners(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
  async removeBanner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
  async updateBanner(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
}
