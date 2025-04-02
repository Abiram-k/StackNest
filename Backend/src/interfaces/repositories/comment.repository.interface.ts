import { Types } from "mongoose";

export interface ICommentRepository<T> {
  createNewComment(
    userId: Types.ObjectId,
    feedId: string,
    parentId: string | null,
    comment: string
  ): Promise<T>;
  getById(commentId:string):Promise<T | null>
  deleteCommentById(commentId:string):Promise<void>
  findChildComments(parentCommentId:string):Promise<T[] | null>
  getUserComments(userId: Types.ObjectId): Promise<string[] | []>;
  findParent(parentId:string):Promise<boolean>
  addReplyToParent(parentId:string,commentId:string):Promise<void>;
  getComments(feedId: string,parentCommentId:string): Promise<T | null>;
}
