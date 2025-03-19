import { Request, Response, NextFunction } from "express";
import { IUserChallengeController } from "../../interfaces/controllers/user.challenge.controller";
import { IChallengeService } from "../../interfaces/services/challenge.service.interface";

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
    try{

    }catch(error){
      next(error)
    }
  }
  async submitChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try{

    }catch(error){
      next(error)
    }
  }
}
