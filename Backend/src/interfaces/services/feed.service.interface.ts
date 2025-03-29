import { Types } from "mongoose";
import { IFeed } from "../../types/IFeed";
import {
  ResFeedType,
  ResGetMyFeedsDTO,
} from "../../dtos/user/feeds/getMyFeeds.dto";
import { ResGetSelectedFeedDTO } from "../../dtos/user/feeds/getSelectedFeed.dto";

export interface IFeedService {
  getAllAvailableFeed(): Promise<ResFeedType[] | []>;
  uploadFeed(
    userId: Types.ObjectId,
    data: {
      title: string;
      content: string;
      media?: string;
      scheduledAt?: string | null;
    }
  ): Promise<boolean>;
  getMyFeeds(userId: Types.ObjectId): Promise<ResFeedType[] | null>;
  getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []>;
  updateFeed(
    userId:Types.ObjectId,
    feedId: string,
    data: {
      title: string;
      content: string;
      media?: string;
      scheduledAt?: string | null;
    }
  ): Promise<boolean>;

  getSelectedFeed(feedId:string):Promise<ResGetSelectedFeedDTO|[]>
  deleteFeed(feedId:string):Promise<boolean>
  toggleLikeFeed(feedId:string,userId:Types.ObjectId):Promise<void>

  // Admin 

  getAllFeeds():Promise<ResFeedType[] | []>;
  blockOrUnblockFeed(feedId:string):Promise<void>;
}
