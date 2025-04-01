import { axiosResponse, FeedReqType, FeedResType } from "@/types";
import { HttpService } from "../httpService";

type MyFeedsType = axiosResponse & {
  myFeeds: FeedResType[];
};
type GetSelectedFeedType = axiosResponse & {
  selectedFeed: {
    media?: string;
    content: string;
    title: string;
  };
};

type GetAvailableFeedsType = axiosResponse & {
  availableFeeds: {
    feedId: string;
    userId: {
      userName: string;
      avatar: string;
    };
    uploadedAt: string;
    title: string;
    content: string;
    media?: string;
    isBlocked: boolean;
    likes: number;
    comments: number;
    viewsCount:number;
  }[];
  nextPage: number | null;
  // totalFeeds:number;
};

type GetAllFeedsType = axiosResponse & {
  availableFeeds: {
    _id: string;
    userId: {
      userName: string;
      avatar: string;
    };
    uploadedAt: string;
    title: string;
    content: string;
    media?: string;
    isBlocked: boolean;
    likes: number;
    comments: number;
    viewsCount:number;
  }[];
};

type GetLikedFeedsType = axiosResponse & {
  likedFeeds: string[];
};

type ResCommentType = axiosResponse & {
  comments: {
    id: string;
    userId: {
      userName: string;
      avatar: string;
    };
    text: string;
    replyCount: number;
    replies: ResCommentType["comments"];
    createdAt: string;
  }[];
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
  async updateFeed(feedId: string, data: FeedReqType): Promise<axiosResponse> {
    return await this._httpService.put(`/users/feed/${feedId}`, data);
  }
  async getSelectedFeed(feedId: string): Promise<GetSelectedFeedType> {
    return await this._httpService.get(`/users/feed/${feedId}`);
  }
  async deleteFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/users/feed/${feedId}`);
  }
  async getAvailableFeeds(
    filter: string,
    sort: string,
    limit: number,
    pageParam: number
  ): Promise<GetAvailableFeedsType> {
    return await this._httpService.get(
      `users/available-feeds?filter=${filter}&sort=${sort}&limit=${limit}&page=${pageParam}`
    );
  }
  async getLikedFeeds(): Promise<GetLikedFeedsType> {
    return await this._httpService.get(`users/feeds/my-likes`);
  }
  async useToggleLikeFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.post("users/feed/like", { feedId });
  }
  async getUserSuggestionFromPrefix(search: string): Promise<string[]> {
    return await this._httpService.get(`/users/suggestion?&search=${search}`);
  }
  async postComment(
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<axiosResponse> {
    return await this._httpService.post(
      `/users/feed/comment?feedId=${feedId}`,
      {
        parentId,
        comment,
      }
    );
  }
  async getComments(feedId: string): Promise<ResCommentType> {
    return await this._httpService.get(`/users/feed/comment/${feedId}`);
  }
  async getReplies(
    feedId: string,
    parentCommentId: string
  ): Promise<ResCommentType & { parentId: string }> {
    return await this._httpService.get(
      `/users/feed-comment/replies?feedId=${feedId}&parentCommentId=${parentCommentId}`
    );
  }

  async incrementViewsCount(feedId:string):Promise<axiosResponse> {
    return await this._httpService.patch(`/users/feed/${feedId}/views`);
  }

  // Admin Calls
  async getAllFeeds(): Promise<GetAllFeedsType> {
    return await this._httpService.get("/admin/feeds");
  }
  async blockOrUnblockFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.put("/admin/feed", { feedId });
  }
  async adminDeleteFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.delete(`/admin/feed/${feedId}`);
  }
}
