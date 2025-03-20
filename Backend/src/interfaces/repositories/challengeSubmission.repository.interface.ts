import { Types } from "mongoose";

export interface IChallengeSubmissionRepository<T> {
  findIsSubmittedChallenge(
    userId: string,
    challengeId: string
  ): Promise<T[] | null>;
  createOne(data: {
    userId: string;
    challengeId: string;
    answer: string;
    isSubmitted: boolean;
  }): Promise<void>;
  findUserSubmittedChallenges(userId:string):Promise<Partial<T>[] | null>
  removeChallengeFromSubmission(challengeId:string):Promise<void>
;}
