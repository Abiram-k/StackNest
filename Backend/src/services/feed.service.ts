import { Types } from "mongoose";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import { IFeedService } from "../interfaces/services/feed.service.interface";
import { IFeed } from "../types/IFeed";
import {
  ResCommentType,
  ResFeedType,
  ResGetMyFeedsDTO,
} from "../dtos/user/feeds/getMyFeeds.dto";
import { ResGetSelectedFeedDTO } from "../dtos/user/feeds/getSelectedFeed.dto";
import { TrieService } from "./trie.service";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
const trieService = new TrieService();

export class FeedService implements IFeedService {
  private _feedRepo: IFeedRepository<IFeed>;
  private _userBaseRepo: IUserBaseRepository<IUser>;
  constructor(
    feedRepo: IFeedRepository<IFeed>,
    userBaseRepo: IUserBaseRepository<IUser>
  ) {
    this._feedRepo = feedRepo;
    this._userBaseRepo = userBaseRepo;
  }

  async getMyFeeds(userId: Types.ObjectId): Promise<ResFeedType[] | null> {
    try {
      const myFeeds = await this._feedRepo.getFeedsByUserId(userId);

      if (!myFeeds) {
        console.log("No My feeds: ", myFeeds);
        return myFeeds;
      }
      let feeds: ResFeedType[] | [];

      feeds = myFeeds.map((feed) => {
        const feedUser = feed.userId as { userName: string; avatar: string };
        return {
          userId: {
            userName: feedUser.userName,
            avatar: feedUser.avatar,
          },
          uploadedAt: new Date(feed.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          feedId: feed._id,
          title: feed.title,
          content: feed.content,
          media: feed.media,
          isBlocked: feed.isBlocked,
          likes: feed.likes.length,
          comments: feed.comments.length,
        };
      });
      return feeds;
    } catch (error) {
      throw error;
    }
  }

  async getAllUserNames(
    userId: Types.ObjectId,
    // filter: string,
    search: string,
    // sort: string
  ): Promise<string[] | []> {
    try {
      const users = await this._userBaseRepo.fetchAllUserNameExceptUser(
        String(userId),
        // filter,
        // search,
        // sort
      );
      const allUserNames = users
        ?.filter(
          (user) =>
            user && Object.keys(user).length > 0 && user.userName !== undefined
        )
        .map((user) => user.userName);
      return allUserNames ? allUserNames : [];
      
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableFeed(): Promise<ResFeedType[] | []> {
    try {
      const feeds = await this._feedRepo.getAllAvailableFeed();
      if (!feeds) return [];

      const formattedFeeds: ResFeedType[] = feeds.map((feed) => {
        const feedUser = feed.userId as { userName: string; avatar: string };
        return {
          userId: {
            userName: feedUser.userName,
            avatar: feedUser.avatar,
          },
          uploadedAt: new Date(feed.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          feedId: feed._id,
          title: feed.title,
          content: feed.content,
          media: feed.media,
          isBlocked: feed.isBlocked,
          likes: feed.likes.length,
          comments: feed.comments.length,
        };
      });
      return formattedFeeds;
    } catch (error) {
      throw error;
    }
  }
  async updateFeed(
    userId: Types.ObjectId,
    feedId: string,
    data: {
      title: string;
      content: string;
      media: string;
      scheduledAt: string;
    }
  ): Promise<boolean> {
    try {
      const formattedData = {
        title: data.title,
        content: data.content,
        media: data.media,
        scheduleAt: data.scheduledAt ? data.scheduledAt : null,
      };
      const isUpdated = await this._feedRepo.findByIdAndUpdate(
        userId,
        feedId,
        formattedData
      );
      return isUpdated;
    } catch (error) {
      throw error;
    }
  }

  async toggleLikeFeed(feedId: string, userId: Types.ObjectId): Promise<void> {
    try {
      await this._feedRepo.toggleLikeFeed(feedId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []> {
    try {
      const feeds = await this._feedRepo.getLikedFeeds(userId);
      return feeds;
    } catch (error) {
      throw error;
    }
  }

  async getSelectedFeed(feedId: string): Promise<ResGetSelectedFeedDTO | []> {
    try {
      const selectedFeed = await this._feedRepo.getFeedById(feedId);
      if (!selectedFeed) {
        return [];
      } else {
        return {
          content: selectedFeed.content,
          title: selectedFeed.title,
          media: selectedFeed.media,
        };
      }
    } catch (error) {
      throw error;
    }
  }
  async uploadFeed(
    userId: Types.ObjectId,
    data: {
      title: string;
      content: string;
      media: string;
      scheduledAt: string;
      userId: string;
    }
  ): Promise<boolean> {
    try {
      const uploadingData = {
        title: data.title,
        content: data.content,
        media: data.media,
        scheduledAt: new Date(data.scheduledAt),
        userId,
      };
      const isUploaded = await this._feedRepo.createFeed(uploadingData);
      return isUploaded;
    } catch (error) {
      throw error;
    }
  }
  async deleteFeed(feedId: string): Promise<boolean> {
    try {
      const isDeleted = await this._feedRepo.deleteFeed(feedId);
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  // Admin

  async getAllFeeds(): Promise<ResFeedType[] | []> {
    try {
      const feeds = await this._feedRepo.getAllFeed();
      if (!feeds) return [];

      const formattedFeeds = feeds.map((feed) => {
        const feedUser = feed.userId as { userName: string; avatar: string };
        return {
          userId: {
            userName: feedUser.userName,
            avatar: feedUser.avatar,
          },
          uploadedAt: new Date(feed.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          _id: feed._id,
          feedId: "",
          title: feed.title,
          content: feed.content,
          media: feed.media,
          isBlocked: feed.isBlocked,
          likes: feed.likes.length,
          comments: feed.comments.length,
        };
      });
      return formattedFeeds;
    } catch (error) {
      throw error;
    }
  }

  async blockOrUnblockFeed(feedId: string): Promise<void> {
    try {
      await this._feedRepo.blockOrUnblockFeed(feedId);
    } catch (error) {
      throw error;
    }
  }
}
