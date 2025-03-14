import { IsString } from "class-validator";

export class RemoveFavoritesDTO {
  @IsString()
  roomId: string;
}

export interface ResRemoveFavoritesDTO {
  message: string;
  success: boolean;
}
