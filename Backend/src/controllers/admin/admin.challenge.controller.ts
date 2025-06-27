import { Request, Response, NextFunction } from "express";
import { IAdminChallengeController } from "../../interfaces/controllers/admin.challenge.controller.interface";
import { IChallengeService } from "../../interfaces/services/challenge.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";
import { plainToInstance } from "class-transformer";
import {
  AddNewChallengeDTO,
  ResAddNewChallengeDTO,
} from "../../dtos/admin/challengeManagement/addNewChallenge.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";
import { GetAllChallengesDTO } from "../../dtos/admin/challengeManagement/getChallenges.dto";
import createHttpError from "http-errors";
import {
  ResUpdateChallengeDTO,
  UpdateChallengeDTO,
} from "../../dtos/admin/challengeManagement/updateChallenge.dto";

export class AdminChallengeController implements IAdminChallengeController {
  private _challengeService: IChallengeService;
  constructor(challengeService: IChallengeService) {
    this._challengeService = challengeService;
  }

  async addNewChallenge(
    req: Request,
    res: Response<ResAddNewChallengeDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = plainToInstance(AddNewChallengeDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      await this._challengeService.addNewChallenge(dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully added new Challenge", success: true });
    } catch (error) {
      next(error);
    }
  }

  async getChallenges(
    req: Request,
    res: Response<GetAllChallengesDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const currentPage = Number(req.query.currentPage) || 1;
      const limit = Number(req.query.limit) || 10;

      const { challenges, totalPages } =
        await this._challengeService.getAllChallenges(currentPage, limit);

      res.status(HttpStatus.OK).json({
        message: "Successfully fetched all challenges",
        success: true,
        challenges,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateChallenge(
    req: Request,
    res: Response<ResUpdateChallengeDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge id not founded");
      const dto = plainToInstance(
        UpdateChallengeDTO,
        req.body
      ) as UpdateChallengeDTO;
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      await this._challengeService.updateChallenge(id, {
        question: dto.question,
        questionNo: dto.questionNo,
        option1: dto.option1,
        option2: dto.option2,
        option3: dto.option3,
        option4: dto.option4,
        answer: dto.answer,
      });
      res
        .status(HttpStatus.OK)
        .json({ message: "Challenge updated", success: true });
    } catch (error) {
      next(error);
    }
  }

  async removeChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("Request got update removeChallenge");

      const { id } = req.params;
      if (!id)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge id not founded");
      await this._challengeService.removeChallenge(id);
      res
        .status(HttpStatus.OK)
        .json({ message: "Challenge removed", success: true });
    } catch (error) {
      next(error);
    }
  }
  async toggleListingChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("Request got toggleListingChallenge");
      const { id } = req.params;
      if (!id)
        throw createHttpError(HttpStatus.NOT_FOUND, "Challenge id not founded");
      await this._challengeService.toggleListing(id);
      res.status(HttpStatus.OK).json({ message: "Action Done", success: true });
    } catch (error) {
      next(error);
    }
  }
}
