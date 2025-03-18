import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
import { IFavorites } from "../../types/IFavorites";

export interface IFavoritesRepository<T> {
  findFavorites(userId: string, roomId: string): Promise<T | null>;
  fetchFavorites(userId: string): Promise<string[] | null>;
  addRoomToFavorites(userId: string, roomId: string): Promise<boolean>;
  removeFromFavorites(userId: string, roomId: string): Promise<boolean>;
}
