import { IsString } from "class-validator";
import { RoomResTypeDTO } from "../../public/roomData.dto";

export class FetchSelectedRoomDTO {
  @IsString()
  id: string;
}

export interface ResFetchSelectedRoomDTO{
    message:string;
    success:boolean;
    room:RoomResTypeDTO;
}