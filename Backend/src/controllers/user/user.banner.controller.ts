import { Request, Response, NextFunction } from "express";
import { IUserBannerController } from "../../interfaces/controllers/user.banner.controller";
import { HttpStatus } from "../../constants/enum.statusCode";
import { IBannerService } from "../../interfaces/services/banner.service.interface";
import {
  ResFetchBannerDTO,
  UserBannerDTO,
} from "../../dtos/user/banner/fetchBanner.dto";

export class UserBannerController implements IUserBannerController {
  private _bannerService: IBannerService;

  constructor(bannerService: IBannerService) {
    this._bannerService = bannerService;
  }

  async fetchBanners(
    req: Request,
    res: Response<ResFetchBannerDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const banners = await this._bannerService.fetchBanners();

      if (!banners) {
        console.log("No banners founded");
        return;
      }
      const formattedData: UserBannerDTO[] = banners?.map((banner) => ({
        title: banner.title,
        description: banner.description,
        image: banner.image, 
      }));
      res.status(HttpStatus.OK).json({
        message: "Fetched successfully",
        success: true,
        banners: formattedData,
      });
    } catch (error) {
      next(error);
    }
  }
}
