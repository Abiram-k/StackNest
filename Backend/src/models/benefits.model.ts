import mongoose from "mongoose";
import { IBenefit } from "../types/IBenefits";

const BenefitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Benefit = mongoose.model<IBenefit>("Benefit", BenefitSchema);
