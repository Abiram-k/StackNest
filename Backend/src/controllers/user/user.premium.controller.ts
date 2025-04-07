import { Request, Response, NextFunction } from "express";
import { IUserPremiumController } from "../../interfaces/controllers/user.premium.controller.interface";
import { IPremiumService } from "../../interfaces/services/premium.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";

export class UserPremiumController implements IUserPremiumController {
  private _premiumService: IPremiumService;
  constructor(premiumService: IPremiumService) {
    this._premiumService = premiumService;
  }

  async getAllListedPremium(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const premiumPlans =  await this._premiumService.getListedPremium();
      res
        .status(HttpStatus.OK)
        .json({
          message: "successfully fetched listed premium",
          success: true,
          premiumPlans
        });
    } catch (error) {
      next(error);
    }
  }
}
