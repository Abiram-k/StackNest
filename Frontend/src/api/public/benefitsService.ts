import { axiosResponse, ReqBenefits, ResBenefit } from "@/types";
import { HttpService } from "../httpService";

type GetAllBenefitsType = axiosResponse & {
  benefits: ResBenefit[];
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
  async getAllBenefits(): Promise<GetAllBenefitsType> {
    return await this._httpService.get("/admin/benefits");
  }
  async getActiveBenefits(): Promise<GetAllBenefitsType> {
    return await this._httpService.get("/admin/benefits-active");
  }
  async getSelectedBenefits(benefitId: string): Promise<GetBenefitsType> {
    return await this._httpService.get(`/admin/benefit/${benefitId}`);
  }
  async addBenefits(data: ReqBenefits): Promise<axiosResponse> {
    return await this._httpService.post("/admin/benefit", data);
  }
  async updateBenefits(
    benefitId: string,
    data: ReqBenefits
  ): Promise<axiosResponse> {
    return await this._httpService.put(`/admin/benefit/${benefitId}`, data);
  }
  async toggleListing(benefitId: string): Promise<axiosResponse> {
    return await this._httpService.patch(`/admin/benefit/${benefitId}`);
  }
  async removeBenefits(benefitId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/admin/benefit/${benefitId}`);
  }
}
