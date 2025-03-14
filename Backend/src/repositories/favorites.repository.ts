import { RoomResTypeDTO } from "../dtos/public/roomData.dto";
import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface";
import { Favorites } from "../models/favorites.model";
import { IFavorites } from "../types/IFavorites";

export class FavoritesRepository implements IFavoritesRepository {
  async findFavorites(
    userId: string,
    roomId: string
  ): Promise<IFavorites | null> {
    try {
      return await Favorites.findOne({ user: userId, roomId });
    } catch (error) {
      throw error;
    }
  }

  async fetchFavorites(userId: string): Promise<RoomResTypeDTO[] | null> {
    try {
      const favorites = await Favorites.find({ user: userId })
        .select("roomId")
        .populate({
          path: "roomId",
          populate: {
            path: "participants.user",
          },
        });

      if (!favorites || favorites.length === 0) {
        console.log("No rooms in favorites");
        return null;
      }

      const rooms = favorites
        .filter((favorite) => favorite.roomId)
        .map((favorite) => favorite.roomId as RoomResTypeDTO);

      return rooms;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }

  async addRoomToFavorites(userId: string, roomId: string): Promise<boolean> {
    try {
      await Favorites.create({ user: userId, roomId });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async removeFromFavorites(userId: string, roomId: string): Promise<boolean> {
    try {
      const result = await Favorites.deleteOne({ user: userId, roomId });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}
