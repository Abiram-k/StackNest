import { Request, Response, NextFunction } from "express";
import { IAdminBenefitController } from "../../interfaces/controllers/admin.benefits.controller.interface.js";
import { IBenefitsService } from "../../interfaces/services/benefits.service.interface.js";
import { HttpStatus } from "../../constants/enum.statusCode.js";
import { plainToInstance } from "class-transformer";
import { AddOrUpdateBenefitDTO } from "../../dtos/admin/benefitManagement/addOrUpdateBenefit.dto.js";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError.js";

export class AdminBenefitsController implements IAdminBenefitController {
  private _benefitsService: IBenefitsService;
  constructor(benefitsService: IBenefitsService) {
    this._benefitsService = benefitsService;
  }

  async getAllBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentPage = Number(req.query.currentPage) || 1;
      const limit = Number(req.query.limit) || 10;
      const { benefits, totalPages } =
        await this._benefitsService.getAllBenefits(currentPage, limit);
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched benefits",
        success: true,
        benefits,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSelectedBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { benefitId } = req.params;
      const benefit = await this._benefitsService.getSelectedBenefits(
        benefitId
      );
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched benefit",
        success: true,
        benefit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const benefits = await this._benefitsService.getActiveBenefits();
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched benefits",
        success: true,
        benefits,
      });
    } catch (error) {
      next(error);
    }
  }

  async addBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(AddOrUpdateBenefitDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._benefitsService.addBenefits(dto);
      res.status(HttpStatus.OK).json({
        message: "Successfully created benefit",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { benefitId } = req.params;
      const dto = plainToInstance(AddOrUpdateBenefitDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._benefitsService.updateBenefits(benefitId, dto);
      res.status(HttpStatus.OK).json({
        message: "Successfully updated benefit",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async toggleListing(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { benefitId } = req.params;
      await this._benefitsService.toggleListing(benefitId);
      res.status(HttpStatus.OK).json({
        message: "Action done",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeBenefits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { benefitId } = req.params;
      await this._benefitsService.removeBenefits(benefitId);
      res.status(HttpStatus.OK).json({
        message: "Successfully removed benefit",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
