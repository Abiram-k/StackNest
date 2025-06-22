import { axiosResponse, ReqPremium, ResPremium } from "@/types";
import { HttpService } from "../httpService";
import { ADMIN_PREMIUM_PLAN_ROUTES } from "@/constants/apiRoutes";

type GetAllPremiumType = axiosResponse & {
  premiumPlans: ResPremium[];
  totalPages: number;
};
type GetSelectedPremiumType = axiosResponse & {
  premiumPlan: ResPremium;
};

export class PremiumPlanService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getAllPremium(
    currentPage: number,
    limit = 10
  ): Promise<GetAllPremiumType> {
    return await this._httpService.get(
      ADMIN_PREMIUM_PLAN_ROUTES.GET_ALL(currentPage, limit)
    );
  }
  async getSelectedPremium(premiumId: string): Promise<GetSelectedPremiumType> {
    return await this._httpService.get(
      ADMIN_PREMIUM_PLAN_ROUTES.GET_SELECTED(premiumId)
    );
  }

  async addPremium(data: ReqPremium): Promise<void> {
    return await this._httpService.post(ADMIN_PREMIUM_PLAN_ROUTES.ADD, data);
  }
  async updatePremium(premiumId: string, data: ReqPremium): Promise<void> {
    return await this._httpService.put(
      ADMIN_PREMIUM_PLAN_ROUTES.UPDATE(premiumId),
      data
    );
  }
  async removePremium(premiumId: string): Promise<void> {
    return await this._httpService.delete(
      ADMIN_PREMIUM_PLAN_ROUTES.DELETE(premiumId)
    );
  }
  async toggleListPremium(premiumId: string): Promise<void> {
    return await this._httpService.patch(
      ADMIN_PREMIUM_PLAN_ROUTES.TOGGLE_LIST(premiumId)
    );
  }
}
