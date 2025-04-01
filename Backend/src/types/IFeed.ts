import { Types } from "mongoose";

export interface IComment {
  _id: string;     
  userId: Types.ObjectId | { userName: string; avatar: string };
  comment: string;
  parentCommentId?: Types.ObjectId | IComment | null;
  likes: Types.ObjectId[];
  replies?: Types.ObjectId[] | IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}
 
export interface IFeed {
  _id: string;     
  userId: Types.ObjectId | { userName: string; avatar: string,email:string };
  title: string;
  content: string;
  media?: string;
  scheduledAt: Date | null;
  isPublished:boolean;
  isBlocked: boolean;
  viewsCount:number;
  views: Types.ObjectId[] ;
  likes: Types.ObjectId[] | { userName: string; avatar: string }[];
  comments: Types.ObjectId[] | IComment[];
  createdAt: Date;
  updatedAt: Date;
}
