import { Types } from "mongoose";
import { IFeed } from "../../types/IFeed";
import {
  ResFeedType,
  ResGetMyFeedsDTO,
} from "../../dtos/user/feeds/getMyFeeds.dto";
import { ResGetSelectedFeedDTO } from "../../dtos/user/feeds/getSelectedFeed.dto";
import { ResCommentDTO } from "../../dtos/user/feeds/getComments.dto";

export interface IFeedService {
  getAllAvailableFeed(
    filter: string,
    sort: string,
    limit: number,
    page: number
  ): Promise<{ feeds: ResFeedType[]; hasMore: boolean }>;
  incrementViewsCount(feedId: string, userId: Types.ObjectId): Promise<void>;
  // deleteComment(feedId:string,)
  getAllUserNames(
    userId: Types.ObjectId,
    // filter: string ,
    search: string
    // sort: string
  ): Promise<string[]>;
  uploadFeed(
    userId: Types.ObjectId,
    data: {
      title: string;
      content: string;
      media?: string;
      scheduledAt?: string | null;
    }
  ): Promise<boolean>;
  postComment(
    userId: Types.ObjectId,
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<void>;

  getComments(feedId: string): Promise<ResCommentDTO[]>;
  getReplies(
    feedId: string,
    parentCommentId: string
  ): Promise<{ replies: ResCommentDTO[]; parentCommentId: string }>;

  getMyFeeds(userId: Types.ObjectId): Promise<ResFeedType[] | null>;
  getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []>;
  deleteComment(feedId: string,commentId:string, userId: Types.ObjectId): Promise<void>;
  getUserComments(userId: Types.ObjectId): Promise<string[] | []>;
  updateFeed(
    userId: Types.ObjectId,
    feedId: string,
    data: {
      title: string;
      content: string;
      media?: string;
      scheduledAt?: string | null;
    }
  ): Promise<boolean>;

  getSelectedFeed(feedId: string): Promise<ResGetSelectedFeedDTO | []>;
  deleteFeed(feedId: string): Promise<boolean>;
  toggleLikeFeed(feedId: string, userId: Types.ObjectId): Promise<void>;

  // Admin

  getAllFeeds(): Promise<ResFeedType[] | []>;
  blockOrUnblockFeed(feedId: string): Promise<void>;
}
