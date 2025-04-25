import { IRoom } from "../../types/IRoom.js";

export interface IFavoritesRepository<T> {
  findFavorites(userId: string, roomId: string): Promise<T | null>;
  fetchFavorites(userId: string): Promise<IRoom[] | null>;
  addRoomToFavorites(userId: string, roomId: string): Promise<boolean>;
  removeFromFavorites(userId: string, roomId: string): Promise<boolean>;
}
