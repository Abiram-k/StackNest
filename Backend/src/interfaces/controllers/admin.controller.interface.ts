import { NextFunction, Request, Response } from "express";

export interface IAdminController {
  fetchAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;

  blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;

  fetchAllAvailableRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  fetchSelectedRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserEngagement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSalesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  blockRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

  getRoomSessionHistory(req:Request,res:Response,next:NextFunction):Promise<void>;
}
