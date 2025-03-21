import createHttpError from "http-errors";
import { RoomResTypeDTO } from "../dtos/public/roomData.dto";
import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface";
import { IFavoritesService } from "../interfaces/services/favorites.service.interface";
import { HttpStatus } from "../constants/enum.statusCode";
import { IFavorites } from "../types/IFavorites";

export class FavoritesService implements IFavoritesService {
  private _favoritesRepository: IFavoritesRepository<IFavorites>;

  constructor(favoritesRepository: IFavoritesRepository<IFavorites>) {
    this._favoritesRepository = favoritesRepository;
  }

  async fetchFavorites(userId: string): Promise<RoomResTypeDTO[] | null> {
    try {
      const rooms = await this._favoritesRepository.fetchFavorites(userId);

      if (!rooms) {
        // throw createHttpError(HttpStatus.NO_CONTENT, "Rooms not found");
        return null;
      }

      const formattedRooms: RoomResTypeDTO[] = rooms.map((room) => ({
        _id: room._id,
        roomId: room.roomId,
        title: room.title,
        description: room.description,
        roomType: room.roomType,
        password: room.password,
        host: room.host,
        isBlocked: room.isBlocked,
        startedAt: room.startedAt,
        participants: room.participants,
        isPrivate: room.isPrivate,
        isPremium: room.isPremium,
        status: room.status,
        scheduledAt: room.scheduledAt,
        endedAt: room.endedAt,
        limit: room.limit,
        createdAt: room.createdAt,
      }));

      return formattedRooms;
    } catch (error) {
      throw error;
    }
  }

  async addToFavorites(userId: string, roomId: string): Promise<void> {
    const isExist = await this._favoritesRepository.findFavorites(
      userId,
      roomId
    );
    if (isExist) {
      throw new Error("Room Already Exist in Favorites");
    }
    const isAdded = await this._favoritesRepository.addRoomToFavorites(
      userId,
      roomId
    );

    if (!isAdded) throw new Error("Failed to add favorites");
  }

  async removeFromFavorites(userId: string, roomId: string): Promise<void> {
    const isExist = await this._favoritesRepository.findFavorites(
      userId,
      roomId
    );
    if (!isExist) {
      throw new Error("Room Not found in Favorites");
    }
    const isRemoved = await this._favoritesRepository.removeFromFavorites(
      userId,
      roomId
    );

    if (!isRemoved) throw new Error("Failed to remove from favorites");
  }
}
