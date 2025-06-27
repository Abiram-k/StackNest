import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { Challenge } from "../models/challenge.model";
import { IChallenge } from "../types/IChallenge";
import { BaseRepository } from "./base.repository";

export class ChallengeRespository
  extends BaseRepository<IChallenge>
  implements IChallengeRespository<IChallenge>
{
  constructor() {
    super(Challenge);
  }
  async findById(challengeId: string): Promise<IChallenge | null> {
    try {
      return await Challenge.findById(challengeId);
      // return null;
    } catch (error) {
      throw error;
    }
  }
  async addNewChallenge(data: Partial<IChallenge>): Promise<boolean> {
    try {
      await this.create(data);
      // await Challenge.create(data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllChallenge(
    currentPage?: number,
    limit?: number
  ): Promise<{ challenges: IChallenge[]; totalPages: number }> {
    try {
      if (currentPage && limit) {
        let totalChallenges = await Challenge.countDocuments();
        let totalPages = Math.floor(totalChallenges / limit);
        const challenges = await Challenge.find()
          .sort({ createdAt: -1 })
          .skip((currentPage - 1) * limit)
          .limit(limit);
        return { challenges, totalPages };
      } else {
        const challenges = await Challenge.find();
        return { challenges, totalPages: 0 };
      }
      // return await Challenge.find();
    } catch (error) {
      throw error;
    }
  }
  async updateChallenge(
    challengeId: string,
    data: Partial<IChallenge>
  ): Promise<boolean> {
    try {
      await this.updateById(challengeId, data);
      // await Challenge.findByIdAndUpdate(challengeId, data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeChallenge(challengeId: string): Promise<void> {
    try {
      await this.deleteById(challengeId);
      // await Challenge.findByIdAndDelete(challengeId);
    } catch (error) {
      throw error;
    }
  }

  async toggleListing(challengeId: string): Promise<void> {
    try {
      // const challenge = await this.findById(challengeId);
      const challenge = await Challenge.findById(challengeId);
      await this.updateById(challengeId, {
        $set: { isListed: !challenge?.isListed },
      });
      // await Challenge.findByIdAndUpdate(challengeId, {
      //   $set: { isListed: !challenge?.isListed },
      // });
    } catch (error) {
      throw error;
    }
  }

  async unListAllChallenge(): Promise<void> {
    try {
      await Challenge.updateMany({}, { $set: { isListed: false } });
    } catch (error) {
      throw error;
    }
  }

  async scheduleChallenge(challengeId: string): Promise<void> {
    try {
      await this.updateById(challengeId, { isListed: true });
      // await Challenge.findByIdAndUpdate(challengeId, { isListed: true });
    } catch (error) {
      console.error("Error scheduling challenges:", error);
      throw error;
    }
  }
}
