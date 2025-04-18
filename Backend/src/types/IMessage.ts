import { Types } from "mongoose";

export interface IMessage {
  _id: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: "text" | "image" | "video";
  reactions: { userId: string; emoji: string }[];
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
