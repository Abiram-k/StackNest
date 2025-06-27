import { Request, Response, NextFunction } from "express";
import { IAdminPremiumController } from "../../interfaces/controllers/admin.premium.controller.interface";
import { IPremiumService } from "../../interfaces/services/premium.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";
import { plainToInstance } from "class-transformer";
import { AddOrUpdatePremiumDTO } from "../../dtos/admin/premiumPlanManagement/addOrUpdatePremium.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";

export class AdminPremiumController implements IAdminPremiumController {
  private _premiumService: IPremiumService;
  constructor(premiumService: IPremiumService) {
    this._premiumService = premiumService;
  }
  async getAllPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentPage = Number(req.query.currentPage) || 1;
      const limit = Number(req.query.limit) || 10;
      const { premium, totalPages } = await this._premiumService.getAllPremium(
        currentPage,
        limit
      );
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched premium plans",
        success: true,
        premiumPlans: premium,
        totalPages,
      });
    } catch (error) {
      next(error); 
    }
  }
  async addPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(AddOrUpdatePremiumDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._premiumService.addPremium(dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully created premium plan", success: true });
    } catch (error) {
      next(error);
    }
  }
  async getSelectedPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { premiumId } = req.params;
      const premiumPlan = await this._premiumService.getSelectedPremium(
        premiumId
      );
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched premium plan",
        success: true,
        premiumPlan,
      });
    } catch (error) {
      next(error);
    }
  }
  async removePremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("Request gotten: ", req.params);
      const { premiumId } = req.params;
      await this._premiumService.removePremium(premiumId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully removed premium plan", success: true });
    } catch (error) {
      next(error);
    }
  }
  async toggleListPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { premiumId } = req.params;
      await this._premiumService.toggleListPremium(premiumId);
      res.status(HttpStatus.OK).json({ message: "Action done", success: true });
    } catch (error) {
      next(error);
    }
  }
  async updatePremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { premiumId } = req.params;
      const dto = plainToInstance(AddOrUpdatePremiumDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._premiumService.updatePremium(premiumId, dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully updated premium plan", success: true });
    } catch (error) {
      next(error);
    }
  }
}
