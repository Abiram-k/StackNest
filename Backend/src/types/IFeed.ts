import { Types } from "mongoose";

export interface IComment {
  userId: Types.ObjectId | { userName: string; avatar: string };
  comment: string;
  parentCommentId?: Types.ObjectId | IComment | null;
  likes: Types.ObjectId[] | { userId: string; avatar: string }[];
  replies?: Types.ObjectId[] | IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFeed {
  _id:string,
  userId: Types.ObjectId | { userName: string; avatar: string };
  title: string;
  content: string;
  media?: string ;
  scheduledAt: Date | null;
  isBlocked: boolean;
  likes: Types.ObjectId[] | { userName: string; avatar: string }[];
  comments: Types.ObjectId[] | IComment[]; 
  createdAt: Date;
  updatedAt: Date;
}
