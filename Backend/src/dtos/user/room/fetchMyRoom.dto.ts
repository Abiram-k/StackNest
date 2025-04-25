import { RoomResTypeDTO } from "../../public/roomData.dto.js";

export interface ResFetchMyRoomsDTO {
    message:string;
    success:boolean;
    rooms:RoomResTypeDTO[]
}