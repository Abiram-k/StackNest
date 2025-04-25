import { RoomResTypeDTO } from "../../public/roomData.dto.js";

export interface ResFetchFavoritesDTO {
  message: string;
  success: boolean;
  rooms: RoomResTypeDTO[] | null;
}
