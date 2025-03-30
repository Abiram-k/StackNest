import { NextFunction, Request, Response } from "express";

export interface IFeedController {
  getAllAvailableFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  uploadFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserSearchSuggestion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  deleteFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getMyFeeds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getLikedFeeds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getSelectedFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  toggleLikeFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

}
