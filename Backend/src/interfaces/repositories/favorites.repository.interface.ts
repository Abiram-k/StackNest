import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
import { IFavorites } from "../../types/IFavorites";

export interface IFavoritesRepository {
  findFavorites(userId: string, roomId: string): Promise<IFavorites | null>;
  fetchFavorites(userId: string): Promise<RoomResTypeDTO[] | null>;
  addRoomToFavorites(userId: string, roomId: string): Promise<boolean>;
  removeFromFavorites(userId: string, roomId: string): Promise<boolean>;
}
