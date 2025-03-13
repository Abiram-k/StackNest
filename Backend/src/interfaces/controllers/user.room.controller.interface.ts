import { NextFunction, Request, Response } from "express";

export interface IUserRoomController {
  createRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

  updateRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

  fetchMyRooms(req: Request, res: Response, next: NextFunction): Promise<void>;

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

  removeRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

  joinRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

  verifyPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
