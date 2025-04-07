import { HttpStatus } from "../constants/enum.statusCode";
import { RewardResDto } from "../dtos/public/rewardData.dto";
import { IRewardRepository } from "../interfaces/repositories/reward.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IRewardService } from "../interfaces/services/reward.service.interface";
import { IReward } from "../types/IReward";
import createHttpError from "http-errors";
import { IUser } from "../types/IUser";
import { Types } from "mongoose";

export class RewardService implements IRewardService {
  private _rewardRepo: IRewardRepository<IReward>;
  private _userRepo: IUserBaseRepository<IUser>;
  constructor(
    rewardRepo: IRewardRepository<IReward>,
    userRepo: IUserBaseRepository<IUser>
  ) {
    this._rewardRepo = rewardRepo;
    this._userRepo = userRepo;
  }

  async getAllRewards(): Promise<RewardResDto[]> {
    try {
      const rewards = await this._rewardRepo.getAllRewards();
      const formattedData: RewardResDto[] = rewards.map((reward) => ({
        _id: reward._id,
        name: reward.name,
        description: reward.description,
        points_cost: reward.points_cost,
        benefit_key: reward.benefit_key,
        type: reward.type,
        isActive: reward.isActive,
        createdAt: reward.createdAt,
        updatedAt: reward.updatedAt,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async claimReward(userId: string, rewardId?: string): Promise<void> {
    try {
      if (!rewardId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward id not founded");
      const reward = await this._rewardRepo.getRewardById(rewardId);
      const user = await this._userRepo.findById(userId);
      if (!reward)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward not founded");
      if (!user) throw createHttpError(HttpStatus.NOT_FOUND, "user not found");

      if (user.challengePoints < reward.points_cost)
        throw createHttpError(HttpStatus.BAD_REQUEST, "Insufficient points!");

      const existingReward = user.rewards.find(
        (reward) => reward.rewardId.toString() === rewardId
      );

      if (existingReward) {
        throw createHttpError(HttpStatus.BAD_REQUEST, "Reward already claimed");
      }

      await this._userRepo.claimReward(
        userId,
        rewardId,
        reward.points_cost,
        reward.benefit_key
      );
    } catch (error) {
      throw error;
    }
  }

  async getclaimedRewards(userId: string): Promise<string[]> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not founded");
      const user = await this._userRepo.findById(userId);
      if (!user)
        throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
      const claimedRewards: string[] = user.rewards.map((reward) =>
        reward.rewardId.toString()
      );
      return claimedRewards;
    } catch (error) {
      throw error;
    }
  }
  async getSelectedReward(rewardId: string): Promise<RewardResDto> {
    try {
      const reward = await this._rewardRepo.getRewardById(rewardId);
      if (!reward)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward not founded!");
      const formattedData: RewardResDto = {
        _id: reward._id,
        name: reward.name,
        description: reward.description,
        points_cost: reward.points_cost,
        benefit_key: reward.benefit_key,
        type: reward.type,
        isActive: reward.isActive,
        createdAt: reward.createdAt,
        updatedAt: reward.updatedAt,
      };
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async addReward(data: Partial<IReward>): Promise<void> {
    try {
      await this._rewardRepo.createReward(data);
    } catch (error) {
      throw error;
    }
  }
  async updateReward(rewardId: string, data: Partial<IReward>): Promise<void> {
    try {
      if (!rewardId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward id not founded!");
      await this._rewardRepo.findByIdAndUpdate(rewardId, data);
    } catch (error) {
      throw error;
    }
  }
  async getActiveRewards(): Promise<Partial<RewardResDto>[]> {
    try {
      const activeRewards = await this._rewardRepo.getActiveRewards();
      const formattedData: RewardResDto[] = activeRewards.map((reward) => ({
        _id: reward._id,
        name: reward.name,
        description: reward.description,
        points_cost: reward.points_cost,
        benefit_key: reward.benefit_key,
        type: reward.type,
        isActive: reward.isActive,
        createdAt: reward.createdAt,
        updatedAt: reward.updatedAt,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async toggleListing(rewardId: string): Promise<void> {
    try {
      if (!rewardId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward id not founded!");
      await this._rewardRepo.toggleList(rewardId);
    } catch (error) {
      throw error;
    }
  }
  async removeReward(rewardId: string): Promise<void> {
    try {
      if (!rewardId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reward id not founded!");
      await this._rewardRepo.findByIdAndRemove(rewardId);
    } catch (error) {
      throw error;
    }
  }
}
