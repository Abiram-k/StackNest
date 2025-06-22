import { axiosResponse, ReqBenefits, ResBenefit } from "@/types";
import { HttpService } from "../httpService";
import { BENEFIT_ROUTES } from "@/constants/apiRoutes";

type GetAllBenefitsType = axiosResponse & {
  benefits: ResBenefit[];
  totalPages: number;
};
type GetBenefitsType = axiosResponse & {
  benefit: {
    name: string;
    description: string;
  };
};

export class BenefitsService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async getAllBenefits(
    currentPage: number,
    limit: number
  ): Promise<GetAllBenefitsType> {
    return await this._httpService.get(
      BENEFIT_ROUTES.GET_ALL_BENEFITS(currentPage, limit)
    );
  }
  async getActiveBenefits(): Promise<GetAllBenefitsType> {
    return await this._httpService.get(BENEFIT_ROUTES.GET_ACTIVE_BENEFITS);
  }
  async getSelectedBenefits(benefitId: string): Promise<GetBenefitsType> {
    return await this._httpService.get(
      BENEFIT_ROUTES.GET_SELECTED_BENEFIT(benefitId)
    );
  }
  async addBenefits(data: ReqBenefits): Promise<axiosResponse> {
    return await this._httpService.post(BENEFIT_ROUTES.ADD_BENEFIT, data);
  }
  async updateBenefits(
    benefitId: string,
    data: ReqBenefits
  ): Promise<axiosResponse> {
    return await this._httpService.put(
      BENEFIT_ROUTES.UPDATE_BENEFIT(benefitId),
      data
    );
  }
  async toggleListing(benefitId: string): Promise<axiosResponse> {
    return await this._httpService.patch(
      BENEFIT_ROUTES.TOGGLE_LISTING(benefitId)
    );
  }
  async removeBenefits(benefitId: string): Promise<axiosResponse> {
    return await this._httpService.delete(
      BENEFIT_ROUTES.REMOVE_BENEFIT(benefitId)
    );
  }
}
