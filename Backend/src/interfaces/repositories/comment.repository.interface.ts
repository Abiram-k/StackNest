import { Types } from "mongoose";

export interface ICommentRepository<T> {
  createNewComment(
    userId: Types.ObjectId,
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<T>;
  findParent(parentId:string):Promise<boolean>
  addReplyToParent(parentId:string,commentId:string):Promise<void>;
  getComments(feedId: string,parentCommentId:string): Promise<T | null>;
}
