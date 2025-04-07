import mongoose, { Schema } from "mongoose";
import { IReward } from "../types/IReward";

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
        "extra_profile_edit",
        "one_premium_room_creation",
        "temporary_premium_access",
        "customer_support",
        "fast_customer_support",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export const Reward = mongoose.model<IReward>("Reward", RewardSchema);



