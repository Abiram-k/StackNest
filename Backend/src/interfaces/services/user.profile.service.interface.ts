import { Types } from "mongoose";
import { GetUserCardData } from "../../dtos/user/profile/getUserCardData.dto.js";
import { PushSubscription } from "web-push";
import {
  IPointsTableData,
  IStatsUser,
  IStreakTableData,
} from "../../dtos/user/profile/getStatsData.dto.js";
import {
  inspectfeedDataDTO,
  inspectuserDataDTO,
  verifyUserProfileSchemaType,
} from "../../dtos/user/profile/getInspectData.dto.js";
export interface IUserProfileService {
  getUserDetails(id: string): Promise<verifyUserProfileSchemaType>;
  getStatsData(userId: string): Promise<{
    user: IStatsUser;
    streakTableData: IStreakTableData;
    pointsTableData: IPointsTableData;
  }>;
  getInspectData(
    userId: string,
    inspectedUserName: string
  ): Promise<{
    isAlreadyInConnection: boolean;
    feedData: inspectfeedDataDTO[] | null;
    userData: inspectuserDataDTO;
  }>;
  getFriendSuggestion(userId: string): Promise<
    {
      avatar: string;
      userName: string;
      firstName: string;
      description: string;
      isVerified:boolean;
    }[]
  >;
  updateUserDetails(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<void>;
  getCardData(userId: Types.ObjectId): Promise<GetUserCardData>;
  checkinUser(userId: string): Promise<void>;
  getUserStreakCount(userId: string): Promise<number | null>;
  getUserChallengePoints(userId: string): Promise<number | null>;
  subscribeUserForPushNotification(
    subscription: PushSubscription,
    userId: string
  ): Promise<void>;
}
