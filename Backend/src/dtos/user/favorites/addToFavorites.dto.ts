import { IsString } from "class-validator";

export class AddToFavoritesDTO {
  @IsString()
  roomId: string;
}

export interface ResAddToFavoritesDTO {
  message: string;
  success: boolean;
}
