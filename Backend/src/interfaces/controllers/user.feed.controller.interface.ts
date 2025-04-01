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
  postComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getCommentReplies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  incrementViewsCount(
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
