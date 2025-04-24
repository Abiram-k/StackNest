import { Request, Response, NextFunction } from "express";
import { IAdminFeedController } from "../../interfaces/controllers/admin.feed.controller.interface";
import { IFeedService } from "../../interfaces/services/feed.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";
import { GetAdminFeedDetailsDTO } from "../../dtos/admin/feedManagement/getFeedDetails.dto";

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
      const filter = String(req.query.filter) || "";
      const sort = String(req.query.sort) || "";
      const search = String(req.query.search) || "";
      const limit = Number(req.query.limit) || 0;
      const page = Number(req.query.page) || 0;
      const { feeds, totalPages } = await this._feedService.getAllFeeds(
        search,
        filter,
        sort,
        page,
        limit
      );
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched feeds",
        success: true,
        availableFeeds: feeds,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeedDetails(
    req: Request,
    res: Response<GetAdminFeedDetailsDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { feedId } = req.params;
      if (!feedId) {
        console.log("Feed id not founded!");
        return;
      }
      const feedDetails = await this._feedService.getFeedDetails(feedId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Fetched feed details", success: true, feedDetails });
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
      const reason = String(req.query.reason) || "";
      await this._feedService.deleteFeed(feedId, reason,"");
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully deleted feed", success: true });
    } catch (error) {
      next(error);
    }
  }
}
