import { HttpStatus } from "../constants/enum.statusCode.js";
import { UpdateChallengeDTO } from "../dtos/admin/challengeManagement/updateChallenge.dto.js";
import { challengeResDTO } from "../dtos/public/challenges.dto.js";
import { IChallengeRespository } from "../interfaces/repositories/challenge.repository.interface.js";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface.js";
import { IChallengeService } from "../interfaces/services/challenge.service.interface.js";
import { IChallenge } from "../types/IChallenge.js";
import createHttpError from "http-errors";
import { IUser } from "../types/IUser.js";
import { IChallengeSubmissionRepository } from "../interfaces/repositories/challengeSubmission.repository.interface.js";
import { IChallengeSubmission } from "../types/IChallengeSubmissionSchema.js";

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
  private _userBaseRepo: IUserBaseRepository<IUser>;
  private _challengeSubmissionRepo: IChallengeSubmissionRepository<IChallengeSubmission>;
  constructor(
    challengeRepo: IChallengeRespository<IChallenge>,
    userBaseRepo: IUserBaseRepository<IUser>,
    challengeSubmissionRepo: IChallengeSubmissionRepository<IChallengeSubmission>
  ) {
    this._challengeRepo = challengeRepo;
    this._userBaseRepo = userBaseRepo;
    this._challengeSubmissionRepo = challengeSubmissionRepo;
  }

  async getAllChallenges(): Promise<challengeResDTO[] | null> {
    return await this._challengeRepo.fetchAllChallenge();
  }
  async addNewChallenge(data: typeChallengeReq): Promise<boolean> {
    try {
      const challenges = await this._challengeRepo.fetchAllChallenge();
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
  async submitChallenge(
    userId: string,
    challengeId: string,
    answer: string
  ): Promise<boolean> {
    try {
      const challenge = await this._challengeRepo.findById(challengeId);
      if (!challenge)
        throw createHttpError(HttpStatus.NOT_FOUND, "No challenge founded");
      if (!userId)
        throw createHttpError(HttpStatus.NOT_FOUND, "No userId founded");

      const userAlreadySubmitted =
        await this._challengeSubmissionRepo.findIsSubmittedChallenge(
          userId,
          challengeId
        );

      if (userAlreadySubmitted?.length) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Already attempted this challenge"
        );
      }

      if (challenge.answer == answer) {
        this._userBaseRepo.incrementChallengePoint(userId);
        await this._challengeSubmissionRepo.createOne({
          userId,
          challengeId,
          isSubmitted: true,
          answer,
        });
        return true;
      } else {
        await this._challengeSubmissionRepo.createOne({
          userId,
          challengeId,
          isSubmitted: false,
          answer,
        });
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async removeChallenge(challengeId: string): Promise<void> {
    try {
      if (!challengeId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge Id not founded");
      const challenge = await this._challengeRepo.fetchAllChallenge();
      if (challenge && challenge?.length <= 4) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Atleast 4 Challenge Needed"
        );
      }
      await this._challengeRepo.removeChallenge(challengeId);
      await this._challengeSubmissionRepo.removeChallengeFromSubmission(
        challengeId
      );
    } catch (error) {
      throw error;
    }
  }

  async sheduleChallenge(challengeIds: string[]): Promise<void> {
    try {
      await this._challengeRepo.unListAllChallenge();
      for (const challengeId of challengeIds) {
        await this._challengeRepo.scheduleChallenge(challengeId);
      }
    } catch (error) {
      throw error;
    }
  }

  async toggleListing(challengeId: string): Promise<void> {
    try {
      if (!challengeId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge Id not founded");
      await this._challengeRepo.toggleListing(challengeId);
    } catch (error) {
      throw error;
    }
  }
  async updateChallenge(
    challengeId: string,
    data: UpdateChallengeDTO
  ): Promise<void> {
    try {
      if (!challengeId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge Id not founded");
      const formattedData = {
        questionNo: data.questionNo,
        question: data.question,
        options: [data.option1, data.option2, data.option3, data.option4],
        answer: data.answer,
      };
      await this._challengeRepo.updateChallenge(challengeId, formattedData);
    } catch (error) {
      throw error;
    }
  }
  async getUserSubmittedChallenges(
    userId: string
  ): Promise<Partial<IChallengeSubmission>[] | null> {
    try {
      // const AllChallengeIds =
      const submittedChallenges =
        await this._challengeSubmissionRepo.findUserSubmittedChallenges(userId);
      if (submittedChallenges) return submittedChallenges;
      else return null;

      // if (AllChallengeIds)
      //   return AllChallengeIds?.map((challenge) => challenge._id.toString());
      // else return null;
    } catch (error) {
      throw error;
    }
  }
}
