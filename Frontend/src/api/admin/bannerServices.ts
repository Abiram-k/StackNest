import { axiosResponse, BannerReq, BannerRes } from "@/types";
import { HttpService } from "../httpService";
import { ADMIN_BANNER_ROUTES } from "@/constants/apiRoutes";

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
    return await this._httpService.get(
      ADMIN_BANNER_ROUTES.GET_SELECTED(bannerId)
    );
  }
  async fetchBanners(): Promise<fetchAllBannerRes> {
    return await this._httpService.get(ADMIN_BANNER_ROUTES.GET_ALL);
  }
  async addBanner(data: BannerReq): Promise<axiosResponse> {
    return await this._httpService.post(ADMIN_BANNER_ROUTES.CREATE, data);
  }
  async updateBanner(
    data: BannerReq,
    bannerId: string
  ): Promise<axiosResponse> {
    return await this._httpService.put(
      ADMIN_BANNER_ROUTES.UPDATE(bannerId),
      data
    );
  }
  async removeBanner(bannerId: string): Promise<axiosResponse> {
    return await this._httpService.delete(ADMIN_BANNER_ROUTES.DELETE(bannerId));
  }
}
