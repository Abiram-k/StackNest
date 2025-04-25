import createHttpError from "http-errors";
import { RoomResTypeDTO } from "../dtos/public/roomData.dto.js";
import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface.js";
import { IFavoritesService } from "../interfaces/services/favorites.service.interface.js";
import { HttpStatus } from "../constants/enum.statusCode.js";
import { IFavorites } from "../types/IFavorites.js";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface.js";
import { IUser } from "../types/IUser.js";

export class FavoritesService implements IFavoritesService {
  private _favoritesRepository: IFavoritesRepository<IFavorites>;
  private _userBaseRepo: IUserBaseRepository<IUser>;

  constructor(
    favoritesRepository: IFavoritesRepository<IFavorites>,
    userBaseRepo: IUserBaseRepository<IUser>
  ) {
    this._favoritesRepository = favoritesRepository;
    this._userBaseRepo = userBaseRepo;
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
    const user = await this._userBaseRepo.findById(userId);
    if (!user) throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");

    const isAuthorisedPremiumRoomCreation =
      user?.rewards.some(
        (reward) => reward.benefitKey == "add_room_favorites"
      ) ||
      user?.premiumBenefits?.some((benefit) =>
        benefit.benefitKeys.includes("add_room_favorites")
      );
    if (!user?.isVerified && !isAuthorisedPremiumRoomCreation) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        "Premium feature: Can't set as favorite"
      );
    }

    if (isExist) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Room Already Exist in Favorites"
      );
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
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Room Not found in Favorites"
      );
    }
    const isRemoved = await this._favoritesRepository.removeFromFavorites(
      userId,
      roomId
    );

    if (!isRemoved) throw new Error("Failed to remove from favorites");
  }
}
