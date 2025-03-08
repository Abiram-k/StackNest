import mongoose, { Schema, Types } from "mongoose";
import { IRoom } from "../types/IRoom";

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
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
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
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", roomSchema);
