import { axiosResponse, BannerReq, BannerRes } from "@/types";
import { HttpService } from "../httpService";

type fetchAllBannerRes = axiosResponse & {
  banners: BannerRes[];
};
type fetchSelectedBannerRes = axiosResponse & {
  banner: BannerRes;
};
export class BannerService {
  private readonly _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async fetchSelectedBanner(bannerId: string): Promise<fetchSelectedBannerRes> {
    return await this._httpService.get(`/admin/banner/${bannerId}`);
  }
  async fetchBanners(): Promise<fetchAllBannerRes> {
    return await this._httpService.get("/admin/banner");
  }
  async addBanner(data: BannerReq): Promise<axiosResponse> {
    return await this._httpService.post("/admin/banner", data);
  }
  async updateBanner(
    data: BannerReq,
    bannerId: string
  ): Promise<axiosResponse> {
    return await this._httpService.put(`/admin/banner/${bannerId}`, data);
  }
  async removeBanner(bannerId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/admin/banner?bannerId=${bannerId}`);
  }
}
