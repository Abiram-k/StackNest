import { Types } from "mongoose";
import { IFeed } from "../../types/IFeed";
import { ResFeedType, ResGetMyFeedsDTO } from "../../dtos/user/feeds/getMyFeeds.dto";

export interface IFeedService {
  // getAllAvailableFeed(): Promise<IFeed | null>;
  uploadFeed(
    userId: Types.ObjectId,
    data: {
      title: string;
      content: string;
      media?: string;
      scheduledAt?: string | null;
    }
  ): Promise<boolean>;
  getMyFeeds(userId:Types.ObjectId):Promise<ResFeedType[] | null>;
  // getMyFeeds(userId:Types.ObjectId):Promise<void>;
  // updateFeed(feedId:string,data:Partial<IFeed>):Promise<boolean>
  // deleteFeed(feedId:string):Promise<boolean>
}
