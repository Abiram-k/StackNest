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
      console.log("Request got to got my feeds");
      const user = req.user as { userId: Types.ObjectId; role: string };
      const myFeeds = await this._feedService.getMyFeeds(user.userId);
      res.status(HttpStatus.OK).json({message:"Successfully fetched my feeds",success:true,myFeeds})
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
      console.log("From Get all feed controller");
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
  async updateFeed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("From Update feed controller");
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
      console.log("From Delete feed controller");
    } catch (error) {
      next(error);
    }
  }
}
