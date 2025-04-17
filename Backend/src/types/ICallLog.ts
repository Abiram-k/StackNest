import { Types } from "mongoose";

export interface ICallLog {
  initiator:
    | Types.ObjectId
    | { _id: string; firstName: string; userName: string; avatar: string };
  reciever:
    | Types.ObjectId
    | { _id: string; firstName: string; userName: string; avatar: string };
  status: "completed" | "rejected" | "missed";
  // duration: number;
  createdAt: Date;
  updatedAt: Date;
}
