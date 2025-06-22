import { axiosResponse, ReqReward, ResReward } from "@/types";
import { HttpService } from "../httpService";
import { REWARD_ROUTES } from "@/constants/apiRoutes";

type GetAllRewardsType = axiosResponse & {
  rewards: ResReward[];
};
type GetRewardType = axiosResponse & {
  reward: ResReward;
};
type GetClaimedRewards = axiosResponse & {
  rewards: string[];
};

export class RewardService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async getAllReward(): Promise<GetAllRewardsType> {
    return await this._httpService.get(REWARD_ROUTES.ADMIN_ALL_REWARDS);
  }
  async getSelectedReward(rewardId: string): Promise<GetRewardType> {
    return await this._httpService.get(
      REWARD_ROUTES.ADMIN_SELECTED_REWARD(rewardId)
    );
  }
  async addReward(data: ReqReward): Promise<axiosResponse> {
    return await this._httpService.post(REWARD_ROUTES.ADMIN_ADD_REWARD, data);
  }
  async updateReward(
    rewardId: string,
    data: ReqReward
  ): Promise<axiosResponse> {
    return await this._httpService.put(
      REWARD_ROUTES.ADMIN_UPDATE_REWARD(rewardId),
      data
    );
  }
  async toggleListing(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.patch(
      REWARD_ROUTES.ADMIN_TOGGLE_LISTING(rewardId)
    );
  }
  async removeReward(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.delete(
      REWARD_ROUTES.ADMIN_REMOVE_REWARD(rewardId)
    );
  }
  async getActiveReward(): Promise<GetAllRewardsType> {
    return await this._httpService.get(REWARD_ROUTES.USER_ACTIVE_REWARDS);
  }
  async claimReward(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.post(REWARD_ROUTES.USER_CLAIM_REWARD, {
      rewardId,
    });
  }
  async getClaimedRewards(): Promise<GetClaimedRewards> {
    return await this._httpService.get(REWARD_ROUTES.USER_CLAIMED_REWARDS);
  }
}
