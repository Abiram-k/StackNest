import { Types } from "mongoose";

export interface IFeedRepository<T> {
  getFeedsByUserId(userId: Types.ObjectId): Promise<T[] | null>;
  createFeed(data: Partial<T>): Promise<boolean>;
  deleteFeed(feedId: string): Promise<boolean>;
  getAllAvailableFeed(): Promise<T[] | null>;
  findByIdAndUpdate(feedId: string, data: Partial<T>): Promise<boolean>;
}
