import { axiosResponse, BannerRes } from "@/types";
import { HttpService } from "../httpService";

export class BannerService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async fetchBanners(): Promise<BannerRes[]> {
    return await this._httpService.get("/admin/banner");
  }
  async addBanner(data: BannerRes): Promise<axiosResponse> {
    return await this._httpService.post("/admin/banner", { data });
  }
  async updateBanner(
    data: BannerRes,
    bannerId: string
  ): Promise<axiosResponse> {
    return await this._httpService.put(`/admin/banner/${bannerId}`, { data });
  }
  async removeBanner(bannerId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/admin/banner/${bannerId}`);
  }
}
