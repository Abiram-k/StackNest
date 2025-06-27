import { NextFunction, Request, Response } from "express";
import { IFavoritesController } from "../../interfaces/controllers/favorites.controller.interface";
import { IFavoritesService } from "../../interfaces/services/favorites.service.interface";
import { HttpStatus } from "../../constants/enum.statusCode";
import { ResFetchFavoritesDTO } from "../../dtos/user/favorites/fetchFavorites.dto";
import { plainToInstance } from "class-transformer";
import { AddToFavoritesDTO } from "../../dtos/user/favorites/addToFavorites.dto";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";
import {
  RemoveFavoritesDTO,
  ResRemoveFavoritesDTO,
} from "../../dtos/user/favorites/removeFavorites.dto";

export class FavoritesController implements IFavoritesController {
  private _favoritesService: IFavoritesService;

  constructor(favoritesService: IFavoritesService) {
    this._favoritesService = favoritesService;
  }

  async fetchFavorites(
    req: Request,
    res: Response<ResFetchFavoritesDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        console.log("user not found in fetch favorites");
        return;
      }

      const { userId } = req.user as { userId: string; role: string };

      const rooms = await this._favoritesService.fetchFavorites(userId);
      res.status(HttpStatus.CREATED).json({
        message: "Successfully Fetched favorites",
        rooms,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async addToFavorites(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        console.log("user not found in fetch favorites");
        return;
      }
      const { userId } = req.user as { userId: string; role: string };

      // const { roomId } = req.body;
      const dto = plainToInstance(AddToFavoritesDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      const { roomId } = dto;

      await this._favoritesService.addToFavorites(userId, roomId);
      res
        .status(HttpStatus.OK)
        .json({ message: "SuccessFully added to favorites", success: true });
    } catch (error) {
      next(error);
    }
  }

  async removeFromFavorites(
    req: Request,
    res: Response<ResRemoveFavoritesDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        console.log("user not found in fetch favorites");
        return;
      }
      const { userId } = req.user as { userId: string; role: string };
      // const roomId = req.query?.roomId as string;
      const dto = plainToInstance(RemoveFavoritesDTO, req.query);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { roomId } = dto;

      if (!roomId) {
        throw new Error("Room Id not found");
      }
      await this._favoritesService.removeFromFavorites(userId, roomId);
      res.status(HttpStatus.OK).json({
        message: "SuccessFully removed from favorites",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
