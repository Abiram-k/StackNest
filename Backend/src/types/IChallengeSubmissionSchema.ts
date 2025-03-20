import { Types } from "mongoose";

export interface IChallengeSubmission {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  answer: string;
  isSubmitted: boolean;
  submittedAt: Date;
}
