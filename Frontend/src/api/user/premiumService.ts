import { axiosResponse, ResPremium } from "@/types";
import { HttpService } from "../httpService";

type GetAllPremiumType = axiosResponse & {
  premiumPlans: ResPremium[];
};
type GetSelectedPremiumType = axiosResponse & {
  premiumPlan: ResPremium;
};

export class PremiumService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getListedPremium(): Promise<GetAllPremiumType> {
    return await this._httpService.get("/users/premium-plans");
  }
  async getSelectedPremium(planId: string): Promise<GetSelectedPremiumType> {
    return await this._httpService.get(`/users/premium-plan/${planId}`);
  }
}
