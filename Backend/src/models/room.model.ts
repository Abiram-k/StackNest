import mongoose, { Schema, Types } from "mongoose";
import { IRoom } from "../types/IRoom.js";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        totalDuration: { type: Number, default: 0 },
        lastJoined: { type: Date, default: new Date() },
      },
    ],
    startedAt: { type: Date, default: null },
    isPrivate: { type: String, default: "No" },
    isPremium: { type: String, default: "No" },
    password: { type: String },
    scheduledAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["online", "offline", "scheduled"],
      default: "offline",
    },
    endedAt: { type: Date, default: null },
    limit: { type: Number, default: 5 },
    createdAt: { type: Date, default: Date.now },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    roomType: {
      type: String,
      enum: ["normal", "general"],
      default: "normal",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", roomSchema);
