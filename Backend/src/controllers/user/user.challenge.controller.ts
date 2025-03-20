import { Request, Response, NextFunction } from "express";
import { IUserChallengeController } from "../../interfaces/controllers/user.challenge.controller";
import { IChallengeService } from "../../interfaces/services/challenge.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";

export class UserChallengeController implements IUserChallengeController {
  private _challengeService: IChallengeService;
  constructor(challengeService: IChallengeService) {
    this._challengeService = challengeService;
  }
  async getChallenges(
    req: Request,
    res: Response,
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
  async submitChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { answer } = req.body;
      const { challengeId } = req.params;
      const user = req.user as { userId: string; role: string };
      const isCorrect = await this._challengeService.submitChallenge(
        user.userId,
        challengeId,
        answer
      );
      res.status(HttpStatus.OK).json({
        message: "challenge submitted successfully",
        success: isCorrect,
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserSubmittedChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string; role: string };
      const submittedChallenges =
        (await this._challengeService.getUserSubmittedChallenges(
          user.userId
        )) || [];
      res.status(HttpStatus.OK).json({
        message: "fetched successfully",
        success: true,
        submittedChallenges,
      });
    } catch (error) {
      next(error);
    }
  }
}
