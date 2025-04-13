import { NextFunction, Request, Response } from "express";

export interface IUserConnectionController {
  sendConnectionRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getConnectionRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getNotifactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
