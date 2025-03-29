import { Request, Response, NextFunction } from "express";
import { IFeedController } from "../../interfaces/controllers/feed.controller.interface";
import { IFeedService } from "../../interfaces/services/feed.service.interface";
import { plainToInstance } from "class-transformer";
import {
  ResAddFeedDTO,
  uploadFeedDTO,
} from "../../dtos/user/feeds/uploadFeed.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";
import { HttpStatus } from "../../constants/enum.statusCode";
import { Types } from "mongoose";
import { ResGetMyFeedsDTO } from "../../dtos/user/feeds/getMyFeeds.dto";

export class FeedController implements IFeedController {
  private _feedService: IFeedService;
  constructor(feedService: IFeedService) {
    this._feedService = feedService;
  }

  async getMyFeeds(
    req: Request,
    res: Response<ResGetMyFeedsDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const myFeeds = await this._feedService.getMyFeeds(user.userId);
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched my feeds",
        success: true,
        myFeeds,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAvailableFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const availableFeeds = await this._feedService.getAllAvailableFeed();
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched available feeds",
        success: true,
        availableFeeds,
      });
    } catch (error) {
      next(error);
    }
  }
  async uploadFeed(
    req: Request,
    res: Response<ResAddFeedDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const dto = plainToInstance(uploadFeedDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._feedService.uploadFeed(user.userId, dto);
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Feed uploaded successfully", success: true });
    } catch (error) {
      next(error);
    }
  }

  async getLikedFeeds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const likedFeeds = await this._feedService.getLikedFeeds(user.userId);
      res
        .status(HttpStatus.OK)
        .json({
          message: "Successfully fetched liked feeds",
          success: true,
          likedFeeds,
        });
    } catch (error) {
      next(error);
    }
  }

  async getSelectedFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { feedId } = req.params;
      const selectedFeed = await this._feedService.getSelectedFeed(feedId);
      res.status(HttpStatus.OK).json({
        message: "Successfully fetched selected feed",
        success: true,
        selectedFeed,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const { feedId } = req.params;
      const dto = plainToInstance(uploadFeedDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      await this._feedService.updateFeed(user.userId, feedId, dto);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully updated feed", success: true });
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
        .json({ mesage: "Successfully deleted feed", success: true });
    } catch (error) {
      next(error);
    }
  }
  async toggleLikeFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const { feedId } = req.body;
      if (!feedId) {
        console.log("FeedId is not availble in controller");
        return;
      }
      await this._feedService.toggleLikeFeed(feedId, user.userId);
      res
        .status(HttpStatus.OK)
        .json({ mesage: "Successfully liked post", success: true });
    } catch (error) {
      next(error);
    }
  }
}
