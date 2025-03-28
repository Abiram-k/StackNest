import { Types } from "mongoose";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import Feed from "../models/feed.model";
import "../models/comments.model";
import { IFeed } from "../types/IFeed";

export class FeedRepository implements IFeedRepository<IFeed> {
  async getFeedsByUserId(userId: Types.ObjectId): Promise<IFeed[] | null> {
    try {
      return await Feed.find({ userId })
        .populate("userId", "userName avatar")
        .populate({
          path: "comments",
          populate: [
            {
              path: "userId",
              select: "userName avatar",
            },
            {
              path: "replies",
              populate: {
                path: "userId",
                select: "userName avatar",
              },
            },
          ],
        });
    } catch (error) {
      throw error;
    }
  }
  async createFeed(data: Partial<IFeed>): Promise<boolean> {
    try {
      await Feed.create(data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteFeed(feedId: string): Promise<boolean> {
    try {
      await Feed.findByIdAndDelete(feedId);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableFeed(): Promise<IFeed[] | null> {
    try {
      return await Feed.find({ isBlocked: false });
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(
    feedId: string,
    data: Partial<IFeed>
  ): Promise<boolean> {
    try {
      await Feed.findByIdAndUpdate(feedId, data);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
