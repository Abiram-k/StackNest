import { Types } from "mongoose";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import { IFeedService } from "../interfaces/services/feed.service.interface";
import { IComment, IFeed } from "../types/IFeed";
import {
  ResCommentType,
  ResFeedType,
  ResGetMyFeedsDTO,
} from "../dtos/user/feeds/getMyFeeds.dto";
import { ResGetSelectedFeedDTO } from "../dtos/user/feeds/getSelectedFeed.dto";
import { TrieService } from "./trie.service";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { ICommentRepository } from "../interfaces/repositories/comment.repository.interface";
import { ResCommentDTO } from "../dtos/user/feeds/getComments.dto";
import createHttpError from "http-errors";
import { HttpStatus } from "../constants/enum.statusCode";
const trieService = new TrieService();

export class FeedService implements IFeedService {
  private _feedRepo: IFeedRepository<IFeed>;
  private _userBaseRepo: IUserBaseRepository<IUser>;
  private _commentRepo: ICommentRepository<IComment>;
  constructor(
    feedRepo: IFeedRepository<IFeed>,
    userBaseRepo: IUserBaseRepository<IUser>,
    commentRepo: ICommentRepository<IComment>
  ) {
    this._feedRepo = feedRepo;
    this._userBaseRepo = userBaseRepo;
    this._commentRepo = commentRepo;
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
          viewsCount: feed.viewsCount,
        };
      });
      return feeds;
    } catch (error) {
      throw error;
    }
  }

  async getAllUserNames(
    userId: Types.ObjectId,
    search: string
  ): Promise<string[] | []> {
    try {
      const users = await this._userBaseRepo.fetchAllUserNameExceptUser(
        String(userId)
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

  async postComment(
    userId: Types.ObjectId,
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<void> {
    try {
      const newComment = await this._commentRepo.createNewComment(
        userId,
        feedId,
        parentId,
        comment
      );
      if (parentId) {
        const isParentIdExist = await this._commentRepo.findParent(parentId);
        if (isParentIdExist) {
          await this._commentRepo.addReplyToParent(parentId, newComment._id);
        }
      }
      if (!parentId) await this._feedRepo.postComment(feedId, newComment._id);
    } catch (error) {
      throw error;
    }
  }

  async getComments(feedId: string): Promise<ResCommentDTO[]> {
    try {
      const feedComments: IFeed | null = await this._feedRepo.getComments(
        feedId
      );

      if (!feedComments)
        throw createHttpError(HttpStatus.NOT_FOUND, "Feed not founded");

      const formattedData: ResCommentDTO[] = feedComments.comments
        .map((comment) => {
          if (comment instanceof Types.ObjectId) {
            console.log("Comment not populated:", comment);
            return null;
          }
          const userInfo =
            comment.userId instanceof Types.ObjectId
              ? { userName: "", avatar: "" }
              : {
                  userName: comment.userId.userName,
                  avatar: comment.userId.avatar,
                };

          return {
            id: comment._id.toString(),
            userId: userInfo,
            text: comment.comment,
            replyCount: comment.replies?.length || 0,
            replies: [],
            createdAt: comment.createdAt?.toISOString(),
          };
        })
        .filter(Boolean) as ResCommentDTO[];

      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async getReplies(
    feedId: string,
    parentCommentId: string
  ): Promise<{ replies: ResCommentDTO[]; parentCommentId: string }> {
    try {
      const comments: IComment | null = await this._commentRepo.getComments(
        feedId,
        parentCommentId
      );
      if (!comments) return { replies: [], parentCommentId };
      if (!comments.replies) return { replies: [], parentCommentId };

      const formattedData: ResCommentDTO[] = comments.replies
        ?.map((comment) => {
          if (comment instanceof Types.ObjectId) {
            console.log("Comment not populated:", comment);
            return null;
          }
          const userInfo =
            comment.userId instanceof Types.ObjectId
              ? { userName: "", avatar: "" }
              : {
                  userName: comment.userId.userName,
                  avatar: comment.userId.avatar,
                };

          return {
            id: comment._id.toString(),
            userId: userInfo,
            text: comment.comment,
            replyCount: comment.replies?.length || 0,
            replies: [],
            createdAt: comment.createdAt?.toISOString(),
          };
        })
        .filter(Boolean) as ResCommentDTO[];

      return { replies: formattedData, parentCommentId };
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableFeed(
    filter: string,
    sort: string,
    limit: number,
    page: number
  ): Promise<{ feeds: ResFeedType[]; hasMore: boolean }> {
    try {
      const isFeedsThere = await this._feedRepo.getAllAvailableFeed(
        filter,
        sort,
        limit,
        page
      );

      if (!isFeedsThere) return { feeds: [], hasMore: false };
      const { feeds, hasMore } = isFeedsThere;

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
          viewsCount: feed.viewsCount,
        };
      });
      return { feeds: formattedFeeds, hasMore };
    } catch (error) {
      throw error;
    }
  }

  async incrementViewsCount(
    feedId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    try {
      if (!feedId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Feed Id not founded");
      await this._feedRepo.incrementViewsCount(feedId, userId);
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
  async getUserComments(userId: Types.ObjectId): Promise<string[] | []> {
    try {
      const comments = await this._commentRepo.getUserComments(userId);
      return comments;
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(
    feedId: string,
    commentId: string,
    userId: Types.ObjectId
  ): Promise<void> {
    try {
      const comment = await this._commentRepo.getById(commentId);
      if (!comment)
        throw createHttpError(HttpStatus.NOT_FOUND, "Comment not founded");
      if (comment.userId != userId) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "You can't delete others comment!"
        );
      }
      const childComments = await this._commentRepo.findChildComments(
        commentId
      );
      if (childComments) {
        for (const childComment of childComments) {
          await this._commentRepo.deleteCommentById(childComment._id);
        }
      }
      await this._commentRepo.deleteCommentById(commentId);
      if (!comment.parentCommentId)
        await this._feedRepo.deleteComment(feedId, commentId);
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
      let scheduledDate: Date | null = null;
      // if (data.scheduledAt) {
      //   const localDate = new Date(data.scheduledAt);
      //   const utcDate = new Date(
      //     localDate.getTime() - localDate.getTimezoneOffset() * 60000
      //   );
      //   scheduledDate = utcDate.toISOString();
      // }
      if (data.scheduledAt) {
        scheduledDate = new Date(data.scheduledAt);
      }

      const uploadingData = {
        title: data.title,
        content: data.content,
        media: data.media,
        scheduledAt: scheduledDate,
        userId,
        isPublished: data.scheduledAt ? false : true,
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
          viewsCount: feed.viewsCount,
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
