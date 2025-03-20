import { NextFunction, Request, Response } from "express";

export interface IUserChallengeController {
  getChallenges(req: Request, res: Response, next: NextFunction): Promise<void>;
  submitChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserSubmittedChallenge(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> ;
}
