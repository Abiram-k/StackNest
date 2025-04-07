import { axiosResponse, ResPremium } from "@/types";
import { HttpService } from "../httpService";

type GetAllPremiumType = axiosResponse & {
  premiumPlans: ResPremium[];
};

export class PremiumService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getListedPremium(): Promise<GetAllPremiumType> {
    return await this._httpService.get("/users/premium-plans");
  }
}
