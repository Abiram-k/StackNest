import { IFavoritesRepository } from "../interfaces/repositories/favorites.repository.interface.js";
import { Favorites } from "../models/favorites.model.js";
import { IFavorites } from "../types/IFavorites.js";
import { IRoom } from "../types/IRoom.js";

export class FavoritesRepository implements IFavoritesRepository<IFavorites> {
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

  async fetchFavorites(userId: string): Promise<IRoom[] | null> {
    try {
      const favorites: IFavorites[] = await Favorites.find({ user: userId })
        .select("roomId")
        .populate({
          path: "roomId",
          model: "Room",
          populate: {
            path: "participants.user",
          },
        });

      if (!favorites || favorites.length === 0) {
        return null;
      }

      const rooms: IRoom[] = favorites
        .filter(
          (favorite) => favorite.roomId && typeof favorite.roomId === "object"
        )
        .map((favorite) => favorite.roomId as IRoom);

      return rooms;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  }

  async addRoomToFavorites(userId: string, roomId: string): Promise<boolean> {
    try {
      const favorites = await Favorites.find({ user: userId });
      if (favorites.length >= 10) {
        throw new Error("Already added 10 rooms");
      }
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
