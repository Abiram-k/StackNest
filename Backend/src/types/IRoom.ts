import { Types } from "mongoose";

export interface IRoom extends Document {
  roomId: string;
  title: string;
  description: string;
  host: Types.ObjectId;
  isBlocked: boolean;
  participants: Types.ObjectId[];
  isPrivate: boolean;
  isPremium: boolean;
  password?: string;
  scheduledAt?: Date;
  status: "online" | "offline" | "scheduled";
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
