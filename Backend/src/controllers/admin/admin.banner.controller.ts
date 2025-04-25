import { Request, Response, NextFunction } from "express";
import { IBannerController } from "../../interfaces/controllers/banner.controller.interface.js";
import { IBannerService } from "../../interfaces/services/banner.service.interface.js";
import { HttpStatus } from "../../constants/enum.statusCode.js";
import { plainToInstance } from "class-transformer";
import {
  AddNewBannerDTO,
  ResAddNewBannerDTO,
} from "../../dtos/admin/bannerManagement/addNewBanner.dto.js";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError.js";
import { ResFetchBannerDTO } from "../../dtos/admin/bannerManagement/fetchBanner.dot.js";
import {
  RemoveBannerDTO,
  ResRemoveBannerDTO,
} from "../../dtos/admin/bannerManagement/removeBanner.dto.js";
import { UpdateBannerDTO } from "../../dtos/admin/bannerManagement/updateBanner.dto.js";
import { ResFetchSelectedBannerDTO } from "../../dtos/admin/bannerManagement/fetchSelectedBanner.dto.js";

export class BannerController implements IBannerController {
  private _bannerService: IBannerService;
  constructor(bannerService: IBannerService) {
    this._bannerService = bannerService;
  }

  async fetchSelectedBanner(
    req: Request,
    res: Response<ResFetchSelectedBannerDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bannerId } = req.params;
      const banner = await this._bannerService.fetchSelectedBanner(bannerId);
      res.json({ success: true, message: "succesfully fetched", banner });
    } catch (error) {
      next(error);
    }
  }

  async addNewBanner(
    req: Request,
    res: Response<ResAddNewBannerDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(AddNewBannerDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._bannerService.addNewBanner(
        dto.title,
        dto.description,
        dto.image
      );
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Added successfully", success: true });
    } catch (error) {
      next(error);
    }
  }
  async fetchBanners(
    req: Request,
    res: Response<ResFetchBannerDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const banners = await this._bannerService.fetchBanners();
      res
        .status(HttpStatus.OK)
        .json({ message: "Fetched successfully", success: true, banners });
    } catch (error) {
      next(error);
    }
  }
  async removeBanner(
    req: Request,
    res: Response<ResRemoveBannerDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(RemoveBannerDTO, req.query);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._bannerService.removeBanner(dto.bannerId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully remove banner", success: true });
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
      const { bannerId } = req.params;
      const dto = plainToInstance(UpdateBannerDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { title, description, image } = dto;
      await this._bannerService.updateBanner(
        bannerId,
        title,
        description,
        image
      );
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully remove banner", success: true });
    } catch (error) {
      next(error);
    }
  }
}
