import { axiosResponse, ReqPremium, ResPremium } from "@/types";
import { HttpService } from "../httpService";

type GetAllPremiumType = axiosResponse & {
  premiumPlans: ResPremium[];
};
type GetSelectedPremiumType = axiosResponse & {
  premiumPlan: ResPremium;
};

export class PremiumPlanService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getAllPremium(): Promise<GetAllPremiumType> {
    return await this._httpService.get("/admin/premium-plans");
  }
  async getSelectedPremium(premiumId: string): Promise<GetSelectedPremiumType> {
    return await this._httpService.get(`/admin/premium-plan/${premiumId}`);
  }

  async addPremium(data: ReqPremium): Promise<void> {
    return await this._httpService.post(`/admin/premium-plan`, data);
  }
  async updatePremium(premiumId: string, data: ReqPremium): Promise<void> {
    return await this._httpService.put(
      `/admin/premium-plan/${premiumId}`,
      data
    );
  }
  async removePremium(premiumId: string): Promise<void> {
    return await this._httpService.delete(`/admin/premium-plan/${premiumId}`);
  }
  async toggleListPremium(premiumId: string): Promise<void> {
    return await this._httpService.patch(`/admin/premium-plan/${premiumId}`);
  }
}
