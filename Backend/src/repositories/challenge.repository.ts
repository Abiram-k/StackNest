import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { Challenge } from "../models/challenge.model";
import { IChallenge } from "../types/IChallenge";

export class ChallengeRespository implements IChallengeRespository<IChallenge> {
  async findById(challengeId: string): Promise<IChallenge | null> {
    try {
      return await Challenge.findById(challengeId);
    } catch (error) {
      throw error;
    }
  }
  async addNewChallenge(data: Partial<IChallenge>): Promise<boolean> {
    try {
      await Challenge.create(data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllChallenge(): Promise<IChallenge[] | null> {
    try {
      return await Challenge.find();
    } catch (error) {
      throw error;
    }
  }
  async updateChallenge(
    challengeId: string,
    data: Partial<IChallenge>
  ): Promise<boolean> {
    try {
      await Challenge.findByIdAndUpdate(challengeId, data);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeChallenge(challengeId: string): Promise<void> {
    try {
      await Challenge.findByIdAndDelete(challengeId);
    } catch (error) {
      throw error;
    }
  }

  async toggleListing(challengeId: string): Promise<void> {
    try {
      const challenge = await Challenge.findById(challengeId);
      await Challenge.findByIdAndUpdate(challengeId, {
        $set: { isListed: !challenge?.isListed },
      });
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
      await Challenge.findByIdAndUpdate(challengeId, { isListed: true });
    } catch (error) {
      console.error("Error scheduling challenges:", error);
      throw error;
    }
  }
}
