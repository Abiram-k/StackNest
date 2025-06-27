import mongoose from "mongoose";
import { IChallenge } from "../types/IChallenge";

const challengeSchema = new mongoose.Schema(
  {
    questionNo: {
      type: Number,
      unique: true,
      required: true,
    },
    question: {
      type: String,
      unique: true,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isListed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model<IChallenge>(
  "Challenge",
  challengeSchema
);
