import { Types } from "mongoose";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import Feed from "../models/feed.model";
import "../models/comments.model";
import { IFeed } from "../types/IFeed";

enum FilterTags {
  "Oldest" = "Oldest",
  "Latest" = "Latest",
}

enum AdminFilterOption {
  "Blocked" = "Blocked",
}
enum AdminSortOptions {
  "MostViewed" = "MostViewed",
  "Latest" = "Latest",
  "Oldest" = "Oldest",
}

export class FeedRepository implements IFeedRepository<IFeed> {
  async getFeedsByUserId(userId: Types.ObjectId): Promise<IFeed[] | null> {
    try {
      return await Feed.find({ userId }).populate(
        "userId",
        "userName avatar isVerified"
      );
    } catch (error) {
      throw error;
    }
  }

  async getFeedById(feedId: string): Promise<IFeed | null> {
    try {
      return await Feed.findById(feedId)
        .populate("userId")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            model: "User",
          },
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

  async getFeedsToPublish(now: Date): Promise<IFeed[]> {
    try {
      return await Feed.find({
        scheduledAt: { $lte: now },
        isPublished: false,
      }).populate("userId");
    } catch (error) {
      throw error;
    }
  }
  async publishFeed(feedId: string): Promise<void> {
    try {
      await Feed.findByIdAndUpdate(feedId, { isPublished: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteFeed(feedId: string): Promise<IFeed | null> {
    try {
      const deletedFeed = await Feed.findByIdAndDelete(feedId).populate(
        "userId"
      );
      return deletedFeed;
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableFeed(
    filter: string,
    sort: string,
    limit: number,
    page: number
  ): Promise<{ feeds: IFeed[]; hasMore: boolean } | null> {
    try {
      let sortQuery: any = {};
      if (filter === FilterTags.Oldest) {
        sortQuery.createdAt = 1;
      } else {
        sortQuery.createdAt = -1;
      }

      const skip = (page - 1) * limit;
      const feeds = await Feed.find({ isBlocked: false, isPublished: true })
        .sort(sortQuery)
        .populate("userId")
        .skip(skip)
        .limit(limit);

      const totalFeeds = await Feed.countDocuments();

      const hasMore = skip + feeds.length < totalFeeds;

      return { feeds, hasMore };
    } catch (error) {
      throw error;
    }
  }

  async incrementViewsCount(
    feedId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    try {
      const feed = await Feed.findOne({ _id: feedId, views: userId });

      if (!feed) {
        await Feed.findByIdAndUpdate(feedId, {
          $addToSet: { views: userId },
          $inc: { viewsCount: 1 },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleLikeFeed(feedId: string, userId: Types.ObjectId): Promise<void> {
    try {
      const feed = await Feed.findById(feedId);

      if (!feed) {
        throw new Error("Feed not found");
      }
      const hasLiked = feed.likes.some((like) => {
        if (like instanceof Types.ObjectId) {
          return like.equals(userId);
        }
      });

      if (hasLiked) {
        await Feed.findByIdAndUpdate(feedId, {
          $pull: { likes: userId },
        });
        // console.log("Like removed");
      } else {
        await Feed.findByIdAndUpdate(feedId, {
          $addToSet: { likes: userId },
        });
        // console.log("Like added");
      }
    } catch (error) {
      throw error;
    }
  }

  async postComment(feedId: string, commentId: string): Promise<void> {
    try {
      await Feed.findByIdAndUpdate(feedId, { $push: { comments: commentId } });
    } catch (error) {
      throw error;
    }
  }

  async getComments(feedId: string): Promise<IFeed | null> {
    try {
      return await Feed.findById(feedId)
        .select(" comments -_id ")
        .populate({
          path: "comments",
          populate: { path: "userId", select: "userName avatar isVerified" },
        });
    } catch (error) {
      throw error;
    }
  }

  async getLikedFeeds(userId: Types.ObjectId): Promise<string[] | []> {
    try {
      const feeds = await Feed.find({ likes: { $in: [userId] } }).select("_id");

      return feeds.map((feed) => feed._id);
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(feedId: string, commentId: string): Promise<void> {
    try {
      await Feed.findByIdAndUpdate(feedId, { $pull: { comments: commentId } });
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(
    userId: Types.ObjectId,
    feedId: string,
    data: Partial<IFeed>
  ): Promise<boolean> {
    try {
      await Feed.findOneAndUpdate({ _id: feedId, userId }, data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getAllFeed(
    search: string,
    filter: string,
    sort: string,
    page: number,
    limit: number
  ): Promise<{ feeds: IFeed[]; totalPages: number } | null> {
    try {
      const query: any = {};

      if (search) query.title = { $regex: `^${search}`, $options: "i" };

      if (filter == AdminFilterOption.Blocked) query.isBlocked = true;

      const sortQuery: any = {};
      if (sort == AdminSortOptions.MostViewed) sortQuery.viewsCount = -1;
      else if (sort == AdminSortOptions.Latest) sortQuery.createdAt = -1;
      else if (sort == AdminSortOptions.Oldest) sortQuery.createdAt = 1;

      const skip = (page - 1) * limit;
      const totalFeeds = await Feed.countDocuments(query);
      const totalPages = Math.ceil(totalFeeds / limit);

      const feeds = await Feed.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

      return { feeds, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async blockOrUnblockFeed(feedId: string): Promise<void> {
    try {
      const feed = await Feed.findById(feedId);
      if (!feed) throw new Error("No feed in this feed Id");
      await Feed.findByIdAndUpdate(feedId, { isBlocked: !feed?.isBlocked });
    } catch (error) {
      throw error;
    }
  }
}
