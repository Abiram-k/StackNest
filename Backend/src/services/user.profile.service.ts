import { HttpStatus } from "../constants/enum.statusCode.js";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface.js";
import { IUserProfileService } from "../interfaces/services/user.profile.service.interface.js";
import { IUser } from "../types/IUser.js";
import { isSameDay } from "date-fns";
import createHttpError from "http-errors";
import { sendStreakMissedMail } from "../utils/email.js";
import { Types } from "mongoose";
import { GetUserCardData } from "../dtos/user/profile/getUserCardData.dto.js";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface.js";
import { IFeed } from "../types/IFeed.js";
import { PushSubscription } from "web-push";
import {
  IPointsTableData,
  IStatsUser,
  IStreakTableData,
} from "../dtos/user/profile/getStatsData.dto.js";
import {
  inspectfeedDataDTO,
  inspectuserDataDTO,
  verifyUserProfileSchemaType,
} from "../dtos/user/profile/getInspectData.dto.js";

export class UserProfileService implements IUserProfileService {
  constructor(
    private _baseRepo: IUserBaseRepository<IUser>,
    private _feedRepo: IFeedRepository<IFeed>
  ) {}

  async subscribeUserForPushNotification(
    subscription: PushSubscription,
    userId: string
  ): Promise<void> {
    try {
      if (!userId) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "User not authenticated"
        );
      }

      const user = await this._baseRepo.findById(userId);
      if (!user) {
        throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
      }

      const isSubscriptionExist = user.pushSubscriptions.some(
        (sub) => sub.endpoint === subscription.endpoint
      );

      if (!isSubscriptionExist)
        await this._baseRepo.pushNewSubscription(subscription, userId);
    } catch (error) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to subscribe user for push notifications"
      );
    }
  }

  async getStatsData(userId: string): Promise<{
    user: IStatsUser;
    streakTableData: IStreakTableData;
    pointsTableData: IPointsTableData;
  }> {
    try {
      const userData = await this._baseRepo.findById(userId);
      const user: IStatsUser = {
        streakCount: userData?.streak || 0,
        points: userData?.challengePoints || 0,
      };
      const streakTable = await this._baseRepo.getStreakTableData();
      const pointTable = await this._baseRepo.getPointsTableData();

      const streakTableData: IStreakTableData = streakTable.map((user) => {
        return {
          userName: user.userName,
          avatar: user.avatar,
          count: user.streak,
        };
      });

      const pointsTableData: IStreakTableData = pointTable.map((user) => {
        return {
          userName: user.userName,
          avatar: user.avatar,
          count: user.challengePoints,
        };
      });

      return { user, streakTableData, pointsTableData };
    } catch (error) {
      throw error;
    }
  }

  async getInspectData(
    userId: string,
    inspectedUserName: string
  ): Promise<{
    feedData: inspectfeedDataDTO[] | null;
    userData: inspectuserDataDTO;
    isAlreadyInConnection: boolean;
  }> {
    try {
      const user = await this._baseRepo.findByUserName(inspectedUserName);
      if (!user)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "User not founded while inspect..."
        );
      const feeds = await this._feedRepo.getFeedsByUserId(user._id);
      if (!feeds)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Feeds not founded while inspect..."
        );
      const userData: inspectuserDataDTO = {
        id: String(user._id),
        avatar: user.avatar,
        connectionCount: user.friends.length,
        description: user.description,
        feedsCount: feeds?.length,
        streakCount: user.streak,
        userName: user.userName,
        isVerified: user.isVerified,
      };
      const feedDataUnfiltered: (inspectfeedDataDTO | null)[] =
        await Promise.all(
          feeds.map(async (f): Promise<inspectfeedDataDTO | null> => {
            const feed = await this._feedRepo.getFeedById(f._id);
            if (!feed) return null;

            return {
              feedId: feed._id.toString(),
              title: feed.title,
              content: feed.content,
              media: feed.media ?? undefined,
              likesCount: feed.likes?.length || 0,
              commentsCount: feed.comments?.length || 0,
              viewsCount: feed.views?.length || 0,
              uploadedAt: feed.createdAt.toISOString(),
            };
          })
        );

      const feedData: inspectfeedDataDTO[] = feedDataUnfiltered.filter(
        (f): f is inspectfeedDataDTO => f !== null
      );
      const friends = user.friends;
      const friendsIds = friends.map((friend) => friend.toString());
      const isAlreadyInConnection = friendsIds.some((id) => id == userId);

      return { userData, feedData, isAlreadyInConnection };
    } catch (error) {
      throw error;
    }
  }

  async getFriendSuggestion(userId: string): Promise<
    {
      avatar: string;
      userName: string;
      firstName: string;
      description: string;
      isVerified: boolean;
    }[]
  > {
    try {
      if (!userId)
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "UserId not founded while suggest..."
        );
      const users = await this._baseRepo.fetchAllUserNameExceptUser(userId);
      const currentUser = await this._baseRepo.findById(userId);
      if (!currentUser)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "current user not founded while suggest..."
        );
      const friends = currentUser.friends;
      const friendIds = friends.map((id) => id.toString());
      if (!users) return [];
      const userData = users
        .filter((user) => !friendIds.includes(String(user._id)))
        .map((user) => ({
          avatar: user.avatar,
          userName: user.userName,
          firstName: user.firstName,
          description: user.description,
          isVerified: user.isVerified,
        }))
        .slice(0, 4);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async getUserDetails(id: string): Promise<verifyUserProfileSchemaType> {
    const user = await this._baseRepo.findById(id);
    if (!user) throw new Error("User not found");
    const data = {
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      userName: user.userName,
      gender: user.gender,
      country: user.country,
      description: user.description,
      mobileNumber: user.mobileNumber,
      streak: user.streak,
      streakClaimDate: user.streakClaimDate,
      isVerified: user.isVerified,
      isChatBotAuthorise:
        user.rewards.some((reward) => reward.benefitKey == "chat_bot_access") ||
        user.premiumBenefits?.some((benefit) =>
          benefit.benefitKeys.includes("chat_bot_access")
        ),
    };
    return data;
  }

  async updateUserDetails(id: string, data: verifyUserProfileSchemaType) {
    const user = await this._baseRepo.findByUserName(data.userName);
    if (user && user.email != data.email)
      throw new Error("User name already exist");

    const isAuthorisedEditViaPoints = user?.rewards?.some(
      (reward) => reward.benefitKey == "profile_image_edit"
    );
    const isAuthorisedEditViaPremium = user?.premiumBenefits?.some((benefit) =>
      benefit.benefitKeys.includes("profile_image_edit")
    );

    if (!isAuthorisedEditViaPoints && !isAuthorisedEditViaPremium) {
      delete data.avatar;
    }
    await this._baseRepo.findByIdAndUpdate(id, data);

    if (!isAuthorisedEditViaPoints && !isAuthorisedEditViaPremium)
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        "Premium Feature: Image can't upload!"
      );
  }
  async checkinUser(userId: string): Promise<void> {
    const user = await this._baseRepo.findById(userId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
    }
    const currentDate = new Date();

    let isAlreadyCheckedIn = isSameDay(currentDate, user?.streakClaimDate);

    if (isAlreadyCheckedIn) {
      throw createHttpError(HttpStatus.FORBIDDEN, "Already checked in");
    }
    await this._baseRepo.incrementCheckin(userId);
  }

  async getUserStreakCount(userId: string): Promise<number | null> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.NOT_FOUND, "User id not founded");
      const user = await this._baseRepo.findById(userId);

      if (!user) throw createHttpError(HttpStatus.FORBIDDEN, "User not found");

      const currentDate = new Date();
      const LastStreamClaimDate = new Date(user.streakClaimDate);
      currentDate.setHours(0, 0, 0, 0);
      LastStreamClaimDate.setHours(0, 0, 0, 0);
      const timeDifferenceMs = Math.abs(
        LastStreamClaimDate.getTime() - currentDate.getTime()
      );
      const daysDifference = Math.ceil(
        timeDifferenceMs / (1000 * 60 * 60 * 24)
      );

      if (daysDifference > 1 && user.streak > 0) {
        await sendStreakMissedMail(user.email, user.userName);
        await this._baseRepo.resetCheckin(userId);
        return null;
      }

      return user.streak;
    } catch (error) {
      throw error;
    }
  }

  async getCardData(userId: Types.ObjectId): Promise<GetUserCardData> {
    try {
      const userData = await this._baseRepo.findById(String(userId));
      if (!userData) {
        throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
      }
      let userFeeds = await this._feedRepo.getFeedsByUserId(userId);
      if (!userFeeds) userFeeds = [];
      const data: GetUserCardData = {
        avatarUrl: userData?.avatar,
        description: userData.description,
        feedsCount: userFeeds?.length ? userFeeds.length : 0,
        friendsCount: userData.friends.length,
        userName: userData.userName,
      };
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getUserChallengePoints(userId: string): Promise<number | null> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.NOT_FOUND, "User id not founded");
      const user = await this._baseRepo.findById(userId);
      if (!user) throw createHttpError(HttpStatus.FORBIDDEN, "User not found");
      return user.challengePoints || 0;
    } catch (error) {
      throw error;
    }
  }
}
