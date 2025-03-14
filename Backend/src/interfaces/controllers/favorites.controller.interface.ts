import { NextFunction, Request, Response } from "express";

export interface IFavoritesController {
    fetchFavorites(req: Request, res: Response, next: NextFunction):Promise<void>;
    addToFavorites(req: Request, res: Response, next: NextFunction):Promise<void>;
    removeFromFavorites(req: Request, res: Response, next: NextFunction):Promise<void>;
}