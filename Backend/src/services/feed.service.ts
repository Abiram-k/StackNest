import { Types } from "mongoose";
import { IFeedRepository } from "../interfaces/repositories/feed.repository.interface";
import { IFeedService } from "../interfaces/services/feed.service.interface";
import { IFeed } from "../types/IFeed";
import {
  ResCommentType,
  ResFeedType,
  ResGetMyFeedsDTO,
} from "../dtos/user/feeds/getMyFeeds.dto";

export class FeedService implements IFeedService {
  private _feedRepo: IFeedRepository<IFeed>;
  constructor(feedRepo: IFeedRepository<IFeed>) {
    this._feedRepo = feedRepo;
  }

  async getMyFeeds(userId: Types.ObjectId): Promise<ResFeedType[] | null> {
    // :Promise<void>{
    try {
      const myFeeds = await this._feedRepo.getFeedsByUserId(userId);

      if (!myFeeds) {
        console.log("No My feeds: ", myFeeds);
        return myFeeds;
      }
      console.log(myFeeds);
      let feeds: ResFeedType[] | [];
      // if (!myFeeds.length) {
      //   feeds = [];
      // } else {
        feeds = myFeeds.map((feed) => {
          const feedUser = feed.userId as { userName: string; avatar: string };
          return {
            userId: {
              userName: feedUser.userName,
              avatar: feedUser.avatar,
            },
            title: feed.title,
            content: feed.content,
            media: feed.media,
            isBlocked: feed.isBlocked,
            likes: feed.likes.length,
            comments: feed.comments.length,
          };
        });
      // }
      return feeds;

      // const feeds: ResFeedType[] = myFeeds.map((feed) => {
      //   if (feed.userId instanceof Types.ObjectId) {
      //     console.log("User id is not populated", userId);
      //     return;
      //   }
      //   let formattedComments: ResCommentType[] | [];

      //   if (!feed.comments.length) {
      //     formattedComments = [];
      //   } else if (feed.comments[0] instanceof Types.ObjectId) {
      //     console.log("Comment  is not populated", feed.comments);
      //     return;
      //   } else {

      //     formattedComments = feed.comments
      //       .map((comment) => {
      //         if (comment instanceof Types.ObjectId) {
      //           return null;
      //         }
      //         if (comment.userId instanceof Types.ObjectId) {
      //           console.log(
      //             "userId inside Comment is not popupalted ",
      //             comment.userId
      //           );
      //           return null;
      //         }
      //         let formattedReplies:ResCommentType[] | [];
      //         if(!comment.replies || !comment.replies?.length){
      //           formattedReplies = [];
      //         }else if(comment.replies[0] instanceof Types.ObjectId){
      //           console.log("Reply is not populated",comment.replies);
      //           return;
      //         }else{
      //           formattedReplies = comment.replies.map(reply=>{
      //             if(reply instanceof Types.ObjectId){
      //               console.log("Replay is not populated again",reply);
      //               return;
      //             }
      //             if(reply.userId instanceof Types.ObjectId){
      //               console.log("User id inside the reply is not populated");
      //               return;
      //             }
      //             return {
      //               userId:{
      //                 userName:reply.userId.userName,
      //                 avatar:reply.userId.avatar,
      //               },
      //               comment:reply.comment,
      //               likes:reply.likes.length,
      //             }
      //           })
      //         }
      //         return {
      //           userId: {
      //             avatar: comment.userId.userName,
      //             userName: comment.userId.avatar,
      //           },
      //           comment: comment.comment,
      //           likes: comment.likes.length,
      //           replies:formattedReplies
      //         };
      //       })
      //       .filter((comment) => comment !== null && comment !== undefined);
      //   }

      //   return {
      //     userId: {
      //       userName: feed.userId.userName,
      //       avatar: feed.userId.avatar,
      //       title: feed.title,
      //       content: feed.content,
      //       media: feed.media,
      //       isBlocked: feed.isBlocked,
      //       likes: feed.likes.length,
      //       comments: formattedComments,
      //     },
      //   };
      // });
    } catch (error) {
      throw error;
    }
  }

  async getAllAvailableFeed(): Promise<IFeed[] | null> {
    try {
      console.log("From get all feed Service");
      return await this._feedRepo.getAllAvailableFeed();
    } catch (error) {
      throw error;
    }
  }
  async updateFeed(feedId: string, data: Partial<IFeed>): Promise<boolean> {
    try {
      console.log("From update feed Service");
      const isUpdated = await this._feedRepo.findByIdAndUpdate(feedId, data);
      return isUpdated;
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
      console.log("From Delete feed Service");
      const isDeleted = await this._feedRepo.deleteFeed(feedId);
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }
}
