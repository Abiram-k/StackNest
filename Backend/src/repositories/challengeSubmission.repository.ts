import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { IChallengeSubmissionRepository } from "../interfaces/repositories/challengeSubmission.repository.interface";
import { Challenge } from "../models/challenge.model";
import { IChallenge } from "../types/IChallenge";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema";
import { ChallengeSubmission } from "../models/challengeSubmission.model";
import { Types } from "mongoose";

export class ChallengeSubmissionRepository
  implements IChallengeSubmissionRepository<IChallengeSubmission>
{
  async findIsSubmittedChallenge(
    userId: string,
    challengeId: string
  ): Promise<IChallengeSubmission[] | null> {
    try {
      return await ChallengeSubmission.find({ userId, challengeId });
    } catch (error) {
      throw error;
    }
  }
  async createOne(data: {
    userId: string;
    challengeId: string;
    answer: string;
    isSubmitted: boolean;
  }): Promise<void> {
    try {
      await ChallengeSubmission.create(data);
    } catch (error) {
      throw error;
    }
  }
  async findUserSubmittedChallenges(
    userId: string
  ): Promise<Partial<IChallengeSubmission>[] | null> {
    try {
      return await ChallengeSubmission.find({ userId }).select("-userId");
    } catch (error) {
      throw error;
    }
  }
  async removeChallengeFromSubmission(challengeId: string): Promise<void> {
    try {
      await ChallengeSubmission.findOneAndDelete({ challengeId });
    } catch (error) {
      throw error;
    }
  }
}
