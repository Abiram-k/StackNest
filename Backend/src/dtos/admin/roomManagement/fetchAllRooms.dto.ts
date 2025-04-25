import { IsString } from "class-validator";
import { RoomResTypeDTO } from "../../public/roomData.dto.js"

export class FetchAllRoomDTO {
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

export interface ResFetchAllRoomDTO {
  message: string;
  success: boolean;
  rooms: RoomResTypeDTO[];
  totalPages: number;
}
