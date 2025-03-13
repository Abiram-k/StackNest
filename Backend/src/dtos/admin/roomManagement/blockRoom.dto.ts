import { IsString } from "class-validator";

export class BlockRoomDTO {
  @IsString()
  id: string;
}

export interface ResBlockRoomDTO {
  message: string;
  success: boolean;
}
