import { NextFunction, Request, Response } from "express";
import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
import { Types } from "mongoose";

export interface IFavoritesService {
  fetchFavorites(userId: string): Promise<RoomResTypeDTO[] | null>;
  addToFavorites(userId: string, roomId: string): Promise<void>;
  removeFromFavorites(userId: string, roomId: string): Promise<void>;
}
