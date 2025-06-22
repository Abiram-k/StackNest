import { axiosResponse, UserBannerRes } from "@/types";
import { HttpService } from "../httpService";
import { BANNER_ROUTES } from "@/constants/apiRoutes";

type BannerRes = axiosResponse & {
  banners: UserBannerRes[];
};

export class UserBannerService {
  private readonly _httpService: HttpService;

  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async fetchUserBanners(): Promise<BannerRes> {
    return this._httpService.get(BANNER_ROUTES.FETCH_USER_BANNERS);
  }
}
