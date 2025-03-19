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
      const challenges = await this._challengeService.getAllChallenges();
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched all challenges",
        success: true,
        challenges,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
    } catch (error) {
      next(error);
    }
  }
}
