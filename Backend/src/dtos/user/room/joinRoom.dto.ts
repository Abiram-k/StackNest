import { IsString } from "class-validator";

export class JoinRoomDTO {
  @IsString()
  roomId: string;
}

export interface ResJoinRoomDTO {
  message: string;
  success: boolean;
  roomId:string;
}
