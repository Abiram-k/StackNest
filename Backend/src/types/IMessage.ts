import { Types } from "mongoose";

export interface IMessage {
  _id: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: "text" | "image" | "video";
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
