import { Types } from "mongoose";

export interface IFeedRepository<T> {
  getFeedsByUserId(userId: Types.ObjectId): Promise<T[] | null>;
  getFeedById(feedId:string):Promise<T | null>
  createFeed(data: Partial<T>): Promise<boolean>;
  deleteFeed(feedId: string): Promise<boolean>;
  deleteFeed(feedId: string): Promise<boolean>;
  getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []>;
  toggleLikeFeed(feedId: string,userId:Types.ObjectId): Promise<void> 
  getAllAvailableFeed(): Promise<T[] | null>;
  findByIdAndUpdate(userId:Types.ObjectId,feedId: string, data: Partial<T>): Promise<boolean>;

  // Admin
  getAllFeed(): Promise<T[] | null>;
  blockOrUnblockFeed(feedId:string):Promise<void>
}
