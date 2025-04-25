import { Schema, model, Types } from "mongoose";
import { IRoomSession } from "../types/IRoomSession.js";

const roomSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    duration: { type: Number, default: 0 },
  }
);

const RoomSession = model<IRoomSession>("RoomSession", roomSessionSchema);
export default RoomSession;
