import { HttpStatus } from "../../constants/enum.statusCode.js";
import { Request, Response, NextFunction } from "express";
import { IUserRewardController } from "../../interfaces/controllers/user.reward.controller.interface.js";
import { IRewardService } from "../../interfaces/services/reward.service.interface.js";

export class UserRewardController implements IUserRewardController {
  private _rewardService: IRewardService;
  constructor(rewardService: IRewardService) {
    this._rewardService = rewardService;
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

  async claimReward(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string; role: string };
      const { rewardId } = req.body;
      await this._rewardService.claimReward(user.userId, rewardId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully claimed reward", success: true });
    } catch (error) {
      next(error);
    }
  }
  async getclaimedRewards(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string; role: string };
      const rewards = await this._rewardService.getclaimedRewards(user.userId);
      res
        .status(HttpStatus.OK)
        .json({
          message: "Successfully fetched claimed rewards",
          success: true,
          rewards,
        });
    } catch (error) {
      next(error);
    }
  }
}
