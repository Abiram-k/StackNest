import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
export interface IFavoritesService {
  fetchFavorites(userId: string): Promise<RoomResTypeDTO[] | null>;
  addToFavorites(userId: string, roomId: string): Promise<void>;
  removeFromFavorites(userId: string, roomId: string): Promise<void>;
}
