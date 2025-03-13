import { IsString } from "class-validator";

export class RemoveRoomDTO {
  @IsString()
  id: string;
}

export interface ResRemoveRoomDTO {
  message: string;
  success: boolean;
}
