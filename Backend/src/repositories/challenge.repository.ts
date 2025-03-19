import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { Challenge } from "../models/challenge.model";
import { IChallenge } from "../types/IChallenge";

export class ChallengeRespository implements IChallengeRespository<IChallenge> {

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
}
