import { axiosResponse, ResPremium } from "@/types";
import { HttpService } from "../httpService";
import { PREMIUM_ROUTES } from "@/constants/apiRoutes";

interface PremiumDTO {
  _id: string;
  benefits: string[];
  discountAmount: number;
  regularAmount: number;
  description: string;
  title: string;
}
export interface PremiumHistoryDTO {
  status: "active" | "expired" | "pending";
  startingDate: string;
  endingDate: string;
  plan: PremiumDTO;
}

type GetAllPremiumType = axiosResponse & {
  premiumPlans: ResPremium[];
};
type GetSelectedPremiumType = axiosResponse & {
  premiumPlan: ResPremium;
};
type GetPremiumHistory = axiosResponse & {
  history: PremiumHistoryDTO[];
};

export class PremiumService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getListedPremium(): Promise<GetAllPremiumType> {
    return await this._httpService.get(PREMIUM_ROUTES.GET_LISTED_PREMIUM);
  }
  async getSelectedPremium(planId: string): Promise<GetSelectedPremiumType> {
    return await this._httpService.get(
      PREMIUM_ROUTES.GET_SELECTED_PREMIUM(planId)
    );
  }
  async getPremiumHistory(): Promise<GetPremiumHistory> {
    return await this._httpService.get(PREMIUM_ROUTES.GET_PREMIUM_HISTORY);
  }
}
