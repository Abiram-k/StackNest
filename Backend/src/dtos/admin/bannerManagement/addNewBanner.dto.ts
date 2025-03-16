import { IsString, IsUrl, MinLength } from "class-validator";

export class AddNewBannerDTO {
  @IsString()
  title: string;
  @IsString()
  @MinLength(8, { message: "Minum 8 charactors required*" })
  description: string;
  @IsString()
  @IsUrl()
  image: string;
}


export interface ResAddNewBannerDTO {
    message:string;
    success:boolean;
}