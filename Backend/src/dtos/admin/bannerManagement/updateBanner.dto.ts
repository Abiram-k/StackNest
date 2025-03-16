import { IsString, IsUrl, MinLength } from "class-validator";

export class UpdateBannerDTO {
  @IsString()
  title: string;
  @IsString()
  @MinLength(8, { message: "Minum 8 charactors required*" })
  description: string;
  @IsString()
  @IsUrl()
  image: string;
}

export interface ResUpdateBannerDTO {
  message: string;
  success: boolean;
}
