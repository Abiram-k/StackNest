import { IsString, IsUrl, MinLength } from "class-validator";

export class RemoveBannerDTO {
  @IsString()
  bannerId: string;
}

export interface ResRemoveBannerDTO {
  message: string;
  success: boolean;
}
