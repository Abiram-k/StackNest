import mongoose, { Schema } from "mongoose";
import { IReward } from "../types/IReward.js";

const RewardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    points_cost: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["authorization", "discount", "bonus", "feature", "custom"],
      default: "authorization",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    benefit_key: {
      type: String,
      enum: [
        "profile_image_edit",
        "premium_room_creation",
        "3d_premium_access",
        "3d_premium_access",
        "fast_customer_support",
        "add_room_favorites",
        "chat_bot_access"
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export const Reward = mongoose.model<IReward>("Reward", RewardSchema);
