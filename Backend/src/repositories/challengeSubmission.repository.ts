import { IChallengeSubmissionRepository } from "../interfaces/repositories/challengeSubmission.repository.interface";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema";
import { ChallengeSubmission } from "../models/challengeSubmission.model";
import { BaseRepository } from "./base.repository";

export class ChallengeSubmissionRepository
  extends BaseRepository<IChallengeSubmission>
  implements IChallengeSubmissionRepository<IChallengeSubmission>
{
  constructor() {
    super(ChallengeSubmission);
  }
  async findIsSubmittedChallenge(
    userId: string,
    challengeId: string
  ): Promise<IChallengeSubmission[] | null> {
    try {
      return await ChallengeSubmission.find({ userId, challengeId });
      return []
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
