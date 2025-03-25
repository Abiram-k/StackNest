import { Types } from "mongoose";

export interface IRoom extends Document {
  _id: string;
  roomId: string;
  title: string;
  description: string;
  host: Types.ObjectId;
  isBlocked: boolean;
  startedAt: Date;
  participants: [{ user: Types.ObjectId; totalDuration: number,lastJoined:Date }];
  isPrivate: string;
  isPremium: string;
  password?: string;
  scheduledAt?: Date;
  status: "online" | "offline" | "scheduled";
  roomType: "normal" | "general";
  endedAt: Date;
  limit: number;
  createdAt: Date;
}
