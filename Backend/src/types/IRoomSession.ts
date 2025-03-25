import { Document, Types } from "mongoose";

export interface IRoomSession extends Document {
  userId: Types.ObjectId;
  roomId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}
