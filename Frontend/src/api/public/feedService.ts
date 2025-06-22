import { axiosResponse, FeedReqType, FeedResType } from "@/types";
import { HttpService } from "../httpService";
import { FEED_ROUTES } from "@/constants/apiRoutes";

type MyFeedsType = axiosResponse & {
  myFeeds: FeedResType[];
};
type GetSelectedFeedType = axiosResponse & {
  feed: {
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
      isVerified: boolean;
    };
    uploadedAt: string;
    title: string;
    content: string;
    media?: string;
    isBlocked: boolean;
    likes: number;
    comments: number;
    viewsCount: number;
  }[];
  nextPage: number | null;
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
    viewsCount: number;
  }[];
  totalPages: number;
};

interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface IComment {
  _id: string;
  content: string;
  user: IUser;
  createdAt: string;
}

type GetAdminFeedDetailsType = axiosResponse & {
  feedDetails: {
    _id: string;
    userId: IUser & { isBlocked: boolean };
    title: string;
    content: string;
    scheduledAt: string | null;
    isPublished: boolean;
    media: string | null;
    isBlocked: boolean;
    viewsCount: number;
    views: string[];
    likes: string[];
    comments: IComment[];
    createdAt: string;
    updatedAt: string;
  };
};

type GetSingleFeedsType = axiosResponse & {
  feed: {
    feedId: string;
    userId: {
      userName: string;
      avatar: string;
      isVerified: boolean;
    };
    uploadedAt: string;
    title: string;
    content: string;
    media?: string;
    isBlocked: boolean;
    likes: number;
    comments: number;
    viewsCount: number;
  };
};

type GetLikedFeedsType = axiosResponse & {
  likedFeeds: string[];
};
type GetCommentedFeedsType = axiosResponse & {
  commentedFeeds: string[];
};

type ResCommentType = axiosResponse & {
  comments: {
    id: string;
    userId: {
      userName: string;
      avatar: string;
      isVerified: boolean;
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
    return await this._httpService.post(FEED_ROUTES.USER_UPLOAD_FEED, data);
  }
  async getMyFeeds(): Promise<MyFeedsType> {
    return await this._httpService.get(FEED_ROUTES.USER_MY_FEEDS);
  }
  async deleteComment(
    feedId: string,
    commentId: string
  ): Promise<axiosResponse> {
    return await this._httpService.delete(
      FEED_ROUTES.USER_DELETE_COMMENT(feedId, commentId)
    );
  }
  async updateFeed(feedId: string, data: FeedReqType): Promise<axiosResponse> {
    return await this._httpService.put(
      FEED_ROUTES.USER_UPDATE_FEED(feedId),
      data
    );
  }

  async getSelectedFeed(feedId: string): Promise<GetSelectedFeedType> {
    return await this._httpService.get(FEED_ROUTES.USER_SELECTED_FEED(feedId));
  }
  async deleteFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.delete(FEED_ROUTES.USER_DELETE_FEED(feedId));
  }

  async getAvailableFeeds(
    filter: string,
    sort: string,
    limit: number,
    pageParam: number
  ): Promise<GetAvailableFeedsType> {
    return await this._httpService.get(
      FEED_ROUTES.USER_AVAILABLE_FEEDS(filter, sort, limit, pageParam)
    );
  }

  async getSingleFeed(feedId: string): Promise<GetSingleFeedsType> {
    return await this._httpService.get(FEED_ROUTES.USER_SINGLE_FEED(feedId));
  }
  async getLikedFeeds(): Promise<GetLikedFeedsType> {
    return await this._httpService.get(FEED_ROUTES.USER_LIKED_FEEDS);
  }
  async getUserComments(): Promise<GetCommentedFeedsType> {
    return await this._httpService.get(FEED_ROUTES.USER_COMMENTED_FEEDS);
  }
  async useToggleLikeFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.post(FEED_ROUTES.USER_TOGGLE_LIKE, {
      feedId,
    });
  }
  async getUserSuggestionFromPrefix(search: string): Promise<string[]> {
    return await this._httpService.get(FEED_ROUTES.USER_SUGGESTIONS(search));
  }
  async postComment(
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<axiosResponse> {
    return await this._httpService.post(FEED_ROUTES.USER_POST_COMMENT(feedId), {
      parentId,
      comment,
    });
  }
  async getComments(feedId: string): Promise<ResCommentType> {
    return await this._httpService.get(FEED_ROUTES.USER_GET_COMMENTS(feedId));
  }
  async getReplies(
    feedId: string,
    parentCommentId: string
  ): Promise<ResCommentType & { parentId: string }> {
    return await this._httpService.get(
      FEED_ROUTES.USER_GET_REPLIES(feedId, parentCommentId)
    );
  }

  async incrementViewsCount(feedId: string): Promise<axiosResponse> {
    return await this._httpService.patch(
      FEED_ROUTES.USER_INCREMENT_VIEWS(feedId)
    );
  }

  // ADMIN ENDPOINTS
  async getAllFeeds(
    search: string,
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<GetAllFeedsType> {
    return await this._httpService.get(
      FEED_ROUTES.ADMIN_GET_ALL_FEEDS(search, filter, sort, page, limit)
    );
  }
  async blockOrUnblockFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.put(FEED_ROUTES.ADMIN_BLOCK_UNBLOCK_FEED, {
      feedId,
    });
  }
  async adminDeleteFeed(feedId: string): Promise<axiosResponse> {
    return await this._httpService.delete(
      FEED_ROUTES.ADMIN_DELETE_FEED(feedId)
    );
  }
  async getFeedDetails(feedId: string): Promise<GetAdminFeedDetailsType> {
    return await this._httpService.get(FEED_ROUTES.ADMIN_FEED_DETAILS(feedId));
  }
  async removeFeedByAdmin(
    feedId: string,
    reason: string
  ): Promise<axiosResponse> {
    return await this._httpService.delete(
      FEED_ROUTES.ADMIN_REMOVE_FEED(feedId, reason)
    );
  }
}
