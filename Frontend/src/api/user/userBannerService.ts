import { UserBannerRes } from "@/types";
import { axiosResponse } from "../../../../types/user";
import { HttpService } from "../httpService";

type BannerRes = axiosResponse & {
  banners: UserBannerRes[];
};

export class UserBannerService {
  private readonly _httpService: HttpService;

  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async fetchUserBanners(): Promise<BannerRes> {
    return this._httpService.get("/users/banner");
  }
}
