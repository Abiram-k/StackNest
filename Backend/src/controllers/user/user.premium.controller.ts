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
      const { userId } = req.user as { userId: string };
      const premiumPlans = await this._premiumService.getListedPremium(userId);
      res.status(HttpStatus.OK).json({
        message: "successfully fetched listed premium",
        success: true,
        premiumPlans,
      });
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
      const { planId } = req.params;
      console.log("Plan Id: ", planId);
      const premiumPlan = await this._premiumService.getSelectedPremium(planId);
      res.status(HttpStatus.OK).json({
        message: "successfully fetched premium",
        success: true,
        premiumPlan,
      });
    } catch (error) {
      next(error);
    }
  }
}
