
import { Request, Response, NextFunction } from "express";

export interface IAdminFeedController {
    getAllFeeds(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFeedDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockFeed(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteFeed(req: Request, res: Response, next: NextFunction): Promise<void>;
    
}