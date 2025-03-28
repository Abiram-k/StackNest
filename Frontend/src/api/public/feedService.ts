import { axiosResponse, FeedReqType, FeedResType } from "@/types";
import { HttpService } from "../httpService";

type MyFeedsType = axiosResponse & {
  myFeeds: FeedResType[];
};

export class FeedService {
  private _httpService: HttpService;
  constructor(httpService: HttpService) {
    this._httpService = httpService;
  }
  async uploadNewFeed(data: FeedReqType): Promise<axiosResponse> {
    return await this._httpService.post("/users/feed", data);
  }
  async getMyFeeds(): Promise<MyFeedsType> {
    return await this._httpService.get("/users/my-feed");
  }

}
