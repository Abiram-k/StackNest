import { Types } from "mongoose";
import { verifyUserProfileSchemaType } from "../../../../types/user";
import { IUser } from "../../types/IUser";
import { GetUserCardData } from "../../dtos/user/profile/getUserCardData.dto";
import { PushSubscription } from "web-push";

export interface IUserProfileService {
  getUserDetails(id: string): Promise<verifyUserProfileSchemaType>;
  updateUserDetails(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<IUser | null>;
  getCardData(userId: Types.ObjectId): Promise<GetUserCardData>;
  checkinUser(userId: string): Promise<void>;
  getUserStreakCount(userId: string): Promise<number | null>;
  getUserChallengePoints(userId: string): Promise<number | null>;
  subscribeUserForPushNotification(
    subscription: PushSubscription,
    userId: string
  ): Promise<void>;
}
