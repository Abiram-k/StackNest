import { IsString } from "class-validator";
import { RoomResTypeDTO } from "../../public/roomData.dto"

export class FetchAvailableRoomDTO {
  @IsString()
  filter: string;
  @IsString()
  sort: string;
  @IsString()
  search: string;
  @IsString()
  page: number;
  @IsString()
  limit: number;
}

export interface ResFetchAvailableRoomDTO {
  message: string;
  success: boolean;
  rooms: RoomResTypeDTO[];
  totalPages: number;
}
