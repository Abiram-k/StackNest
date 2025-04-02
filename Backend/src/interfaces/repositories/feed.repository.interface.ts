import { Types } from "mongoose";

export interface IFeedRepository<T> {
  getFeedsByUserId(userId: Types.ObjectId): Promise<T[] | null>;
  getFeedById(feedId: string): Promise<T | null>;
  createFeed(data: Partial<T>): Promise<boolean>;
  deleteFeed(feedId: string): Promise<boolean>;
  deleteFeed(feedId: string): Promise<boolean>;
  getFeedsToPublish(now: Date): Promise<T[] >;
  deleteComment(feedId:string,commentId:string):Promise<void>;
  publishFeed(feedId:string):Promise<void>
  getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []>;
  toggleLikeFeed(feedId: string, userId: Types.ObjectId): Promise<void>;
  getAllAvailableFeed(
    filter: string,
    sort: string,
    limit: number,
    page: number
  ): Promise<{ feeds: T[]; hasMore: boolean } | null>;
  findByIdAndUpdate(
    userId: Types.ObjectId,
    feedId: string,
    data: Partial<T>
  ): Promise<boolean>;
  incrementViewsCount(feedId: string, userId: Types.ObjectId): Promise<void>;
  postComment(feedId: string, commentId: string): Promise<void>;
  getComments(feedId: string): Promise<T | null>;

  // Admin
  getAllFeed(): Promise<T[] | null>;
  blockOrUnblockFeed(feedId: string): Promise<void>;
}
