import mongoose from "mongoose";
import { IPremium } from "../types/IPremium";

const PremiumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    regularAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
 
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Premium = mongoose.model<IPremium>("PremiumPlans", PremiumSchema);
