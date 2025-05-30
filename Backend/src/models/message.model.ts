import mongoose, { Schema, Types } from "mongoose";
import { IMessage } from "../types/IMessage.js";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User", required: true },
    receiver: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["text", "image", "video"], default: "text" },
    reactions: {
      type: [
        {
          userId: { type: String, required: true },
          emoji: { type: String, required: true },
        },
      ],
      default: [],
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
