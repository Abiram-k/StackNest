import { NextFunction, Request, Response } from "express";

export interface IUserPremiumController {
    getAllListedPremium(req: Request, res: Response, next: NextFunction): Promise<void>;
}