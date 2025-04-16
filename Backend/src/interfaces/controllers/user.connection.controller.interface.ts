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
  getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  acceptRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  rejectRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  unfollow(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getAllConnections(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  toggleIsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUnreadMessageCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
