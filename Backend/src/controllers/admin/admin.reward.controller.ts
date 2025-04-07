import { Request, Response, NextFunction } from "express";
import { IAdminRewardController } from "../../interfaces/controllers/admin.reward.controller.interface";
import { IRewardService } from "../../interfaces/services/reward.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";
import { plainToInstance } from "class-transformer";
import { AddOrUpdateRewardDTO } from "../../dtos/admin/rewardManagement/addOrUpdateReward.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";

export class AdminRewardController implements IAdminRewardController {
  private _rewardService: IRewardService;
  constructor(rewardService: IRewardService) {
    this._rewardService = rewardService;
  }
  async addReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(AddOrUpdateRewardDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._rewardService.addReward(dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully added reward", success: true });
    } catch (error) {
      next(error);
    }
  }
  async getAllReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const rewards = await this._rewardService.getAllRewards();
      res
        .status(HttpStatus.OK)
        .json({
          message: "Successfully fetched all rewards",
          success: true,
          rewards,
        });
    } catch (error) {
      next(error);
    }
  }
  async getSelectedReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rewardId } = req.params;
      const reward = await this._rewardService.getSelectedReward(rewardId);
      res
        .status(HttpStatus.OK)
        .json({
          message: "Successfully fetched reward",
          success: true,
          reward,
        });
    } catch (error) {
      next(error);
    }
  }
  async updateReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rewardId } = req.params;

      const dto = plainToInstance(AddOrUpdateRewardDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._rewardService.updateReward(rewardId, dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully updated reward", success: true });
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
      const { rewardId } = req.params;
      await this._rewardService.toggleListing(rewardId);
      res.status(HttpStatus.OK).json({ message: "Action done", success: true });
    } catch (error) {
      next(error);
    }
  }
  async getActiveReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const rewards = await this._rewardService.getActiveRewards();
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched active rewards",
        success: true,
        rewards,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { rewardId } = req.params;
      await this._rewardService.removeReward(rewardId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully removed rewards", success: true });
    } catch (error) {
      next(error);
    }
  }
}
