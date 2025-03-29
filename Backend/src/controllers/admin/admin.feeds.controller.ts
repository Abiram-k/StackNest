import { Request, Response, NextFunction } from "express";
import { IAdminFeedController } from "../../interfaces/controllers/admin.feed.controller.interface";
import { IFeedService } from "../../interfaces/services/feed.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";

export class AdminFeedController implements IAdminFeedController {
  private _feedService: IFeedService;
  constructor(feedService: IFeedService) {
    this._feedService = feedService;
  }

  async getAllFeeds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const availableFeeds = await this._feedService.getAllFeeds();
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched feeds",
        success: true,
        availableFeeds,
      });
    } catch (error) {
      next(error);
    }
  }

  async blockOrUnblockFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { feedId } = req.body;
      await this._feedService.blockOrUnblockFeed(feedId);
      res.status(HttpStatus.OK).json({ message: "Action done", success: true });
    } catch (error) {
      next(error);
    }
  }

  async deleteFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { feedId } = req.params;
      await this._feedService.deleteFeed(feedId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully deleted feed", success: true });
    } catch (error) {
      next(error);
    }
  }
}
