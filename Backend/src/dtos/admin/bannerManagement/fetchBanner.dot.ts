import { IsString, IsUrl, MinLength } from "class-validator";
import { BannerResDTO } from "../../public/bannerData.dto";

export class FetchBannerDTO {
  @IsString()
  title: string;
  @IsString()
  @MinLength(8, { message: "Minum 8 charactors required*" })
  description: string;
  @IsString()
  @IsUrl()
  image: string;
}

export interface ResFetchBannerDTO {
  message: string;
  success: boolean;
  banners: BannerResDTO[] | null;
}
