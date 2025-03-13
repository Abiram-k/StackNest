import { RoomResTypeDTO } from "../../public/roomData.dto";

export interface ResFetchMyRoomsDTO {
    message:string;
    success:boolean;
    rooms:RoomResTypeDTO[]
}