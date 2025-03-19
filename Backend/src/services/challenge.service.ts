import { HttpStatus } from "../constants/enum.statusCode";
import { challengeResDTO } from "../dtos/public/challenges.dto";
import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface";
import { IChallengeService } from "../interfaces/services/challenge.service.interface";
import { IChallenge } from "../types/IChallenge";
import createHttpError from "http-errors";

type typeChallengeReq = {
  answer: string;
  option4: string;
  option3: string;
  option2: string;
  option1: string;
  question: string;
  questionNo: number;
};

export class ChallengeService implements IChallengeService {
  private _challengeRepo: IChallengeRespository<IChallenge>;
  constructor(challengeRepo: IChallengeRespository<IChallenge>) {
    this._challengeRepo = challengeRepo;
  }

  async getAllChallenges(): Promise<challengeResDTO[] | null> {
    return await this._challengeRepo.fetchAllChallenge();
  }
  async addNewChallenge(data: typeChallengeReq): Promise<boolean> {
    try {
      const challenges = await this._challengeRepo.fetchAllChallenge();
      if (
        challenges &&
        challenges.filter((challenge) => challenge.isListed).length >= 4
      ) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Only 4 rooms can create at a time"
        );
      }
      const isQuestionNumberExisit = challenges?.some(
        (challenge) => challenge.questionNo == data.questionNo
      );
      if (isQuestionNumberExisit) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Question number already exists"
        );
      }
      const isQuestionExisit = challenges?.some(
        (challenge) => challenge.question == data.question
      );
      if (isQuestionExisit) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Question already exists"
        );
      }

      const formattedData = {
        questionNo: data.questionNo,
        question: data.question,
        options: [data.option1, data.option2, data.option3, data.option4],
        answer: data.answer,
      };
      await this._challengeRepo.addNewChallenge(formattedData);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
