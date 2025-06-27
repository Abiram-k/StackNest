import { IRewardRepository } from "../interfaces/repositories/reward.repository.interface";
import { Reward } from "../models/reward.model";
import { IReward } from "../types/IReward";
import { BaseRepository } from "./base.repository";

export class RewardRepository
  extends BaseRepository<IReward>
  implements IRewardRepository<IReward>
{
  constructor() {
    super(Reward);
  }
  async getAllRewards(): Promise<IReward[]> {
    try {
      // return await Reward.find();
      return await this.findAll();
    } catch (error) {
      throw error;
    }
  }
  async createReward(data: Partial<IReward>): Promise<void> {
    try {
      // await Reward.create(data);
      await this.create(data);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndRemove(rewardId: string): Promise<void> {
    try {
      await Reward.findByIdAndDelete(rewardId);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndUpdate(
    rewardId: string,
    data: Partial<IReward>
  ): Promise<void> {
    try {
      await Reward.findByIdAndUpdate(rewardId, data);
    } catch (error) {
      throw error;
    }
  }
  async toggleList(rewardId: string): Promise<void> {
    try {
      const reward = await Reward.findById(rewardId);
      if (!reward) throw new Error("Reward not founded, on listing");
      await Reward.findByIdAndUpdate(rewardId, { isActive: !reward?.isActive });
    } catch (error) {
      throw error;
    }
  }
  async getRewardById(rewardId: string): Promise<IReward | null> {
    try {
      return await this.findById(rewardId);
      // return await Reward.findById(rewardId);
    } catch (error) {
      throw error;
    }
  }
  async getActiveRewards(): Promise<IReward[]> {
    try {
      return await this.findAll({ isActive: true });
      // return await Reward.find({ isActive: true });
    } catch (error) {
      throw error;
    }
  }
}
