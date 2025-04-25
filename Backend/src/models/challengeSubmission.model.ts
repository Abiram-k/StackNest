import mongoose from "mongoose";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema.js";

const challengeSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ChallengeSubmission = mongoose.model<IChallengeSubmission>(
  "challengeSubmission",
  challengeSubmissionSchema
);
