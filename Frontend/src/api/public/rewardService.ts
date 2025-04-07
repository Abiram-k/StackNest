import { axiosResponse, ReqReward, ResReward } from "@/types";
import { HttpService } from "../httpService";

type GetAllRewardsType = axiosResponse & {
  rewards: ResReward[];
};
type GetRewardType = axiosResponse & {
  reward: ResReward;
};
type GetClaimedRewards = axiosResponse & {
  rewards:string[]
}

export class RewardService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }

  async getAllReward(): Promise<GetAllRewardsType> {
    return await this._httpService.get("/admin/rewards");
  }
  async getSelectedReward(rewardId: string): Promise<GetRewardType> {
    return await this._httpService.get(`/admin/reward/${rewardId}`);
  }
  async addReward(data: ReqReward): Promise<axiosResponse> {
    return await this._httpService.post("/admin/reward", data);
  }
  async updateReward(
    rewardId: string,
    data: ReqReward
  ): Promise<axiosResponse> {
    return await this._httpService.put(`/admin/reward/${rewardId}`, data);
  }
  async toggleListing(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.patch(`/admin/reward/${rewardId}`);
  }
  async removeReward(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/admin/reward/${rewardId}`);
  }
  async getActiveReward(): Promise<GetAllRewardsType> {
    return await this._httpService.get("/users/rewards-active");
  }
  async claimReward(rewardId: string): Promise<axiosResponse> {
    return await this._httpService.post("/users/reward/claim", { rewardId });
  }
  async getClaimedRewards(): Promise<GetClaimedRewards> {
    return await this._httpService.get("/users/reward/claim");
  }
}
