import { Types } from "mongoose";
import { ICommentRepository } from "../interfaces/repositories/comment.repository.interface.js";
import CommentsModel from "../models/comments.model.js";
import { IComment } from "../types/IFeed.js";
import { BaseRepository } from "./base.repository.js";

export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository<IComment>
{
  constructor() {
    super(CommentsModel);
  }
  async getComments(
    feedId: string,
    parentCommentId: string
  ): Promise<IComment | null> {
    try {
      return await CommentsModel.findOne({ feedId, _id: parentCommentId })
        .select("replies")
        .populate({
          path: "replies",
          populate: {
            path: "userId",
            select: "userName avatar",
          },
        });
    } catch (error) {
      throw error;
    }
  }

  async getById(commentId: string): Promise<IComment | null> {
    try {
      return await CommentsModel.findById(commentId);
    } catch (error) {
      throw error;
    }
  }

  async deleteCommentById(commentId: string): Promise<void> {
    try {
      await CommentsModel.findByIdAndDelete(commentId);
    } catch (error) {
      throw error;
    }
  }

  async findChildComments(parentCommentId: string): Promise<IComment[] | null> {
    try {
      return await CommentsModel.find({ parentCommentId });
    } catch (error) {
      throw error;
    }
  }

  async getUserComments(userId: Types.ObjectId): Promise<string[] | []> {
    try {
      const comments = await CommentsModel.find({ userId });
      // const comments = await CommentsModel.find({ userId });
      return comments.map((comment) => comment._id);
    } catch (error) {
      throw error;
    }
  }

  async createNewComment(
    userId: Types.ObjectId,
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<IComment> {
    try {
      return await CommentsModel.create({
        feedId,
        userId,
        comment,
        parentCommentId: parentId,
      });
    } catch (error) {
      throw error;
    }
  }

  async addReplyToParent(parentId: string, commentId: string): Promise<void> {
    try {
      await CommentsModel.findByIdAndUpdate(parentId, {
        $push: { replies: commentId },
      });
    } catch (error) {
      throw error;
    }
  }

  async findParent(parentId: string): Promise<boolean> {
    try {
      const comment = await CommentsModel.findOne({
        parentCommentId: parentId,
      });
      if (!comment) return false;
      return true;
    } catch (error) {
      throw error;
    }
  }
}
