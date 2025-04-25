import { RewardResDto } from "../../dtos/public/rewardData.dto.js";
import { IReward } from "../../types/IReward.js";

export interface IRewardService {
    addReward(data: Partial<IReward>): Promise<void>;
    claimReward(userId:string,rewardId?:string):Promise<void>;
    getclaimedRewards(userId:string):Promise<string[]>;
      getAllRewards(): Promise<RewardResDto[]>;
      getActiveRewards(): Promise<Partial<RewardResDto>[]>;
      getSelectedReward(rewardId: string): Promise<RewardResDto>;
      updateReward(rewardId: string, data: Partial<IReward>): Promise<void>;
      toggleListing(rewardId: string): Promise<void>;
      removeReward(rewardId: string): Promise<void>;
}