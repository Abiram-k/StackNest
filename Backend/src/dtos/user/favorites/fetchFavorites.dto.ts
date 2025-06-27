import { RoomResTypeDTO } from "../../public/roomData.dto";

export interface ResFetchFavoritesDTO {
  message: string;
  success: boolean;
  rooms: RoomResTypeDTO[] | null;
}
