import { Types } from "mongoose";

export interface IRoom extends Document {
  roomId: string;
  title: string;
  description: string;
  host: Types.ObjectId;
  isBlocked: boolean;
  startedAt:Date,
  participants: Types.ObjectId[];
  isPrivate: string;
  isPremium: string;
  password?: string;
  scheduledAt?: Date;
  status: "online" | "offline" | "scheduled";
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
