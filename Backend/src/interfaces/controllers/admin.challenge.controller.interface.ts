import { NextFunction, Request, Response } from "express";
import { ResAddNewChallengeDTO } from "../../dtos/admin/challengeManagement/addNewChallenge.dto";

export interface IAdminChallengeController {
  getChallenges(req: Request, res: Response, next: NextFunction): Promise<void>;
  addNewChallenge(
    req: Request,
    res: Response<ResAddNewChallengeDTO>,
    next: NextFunction
  ): Promise<void>;
  toggleListingChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  
  removeChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
