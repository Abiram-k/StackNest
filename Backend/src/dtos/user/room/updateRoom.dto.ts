import { IsString } from "class-validator";

export class UpdateRoomDTO {
  @IsString()
  id: string;
}

export interface ResUpdateRoomDTO {
  message: string;
  success: boolean;
}
