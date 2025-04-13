import { Types } from "mongoose";

export interface INotification {
  _id:Types.ObjectId,
  sender: Types.ObjectId | { userName: string; avatar: string };
  reciever: Types.ObjectId | { userName: string; avatar: string };
  status: "pending" | "resolved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
