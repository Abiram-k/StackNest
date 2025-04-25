import { IsString, IsUrl, MinLength } from "class-validator";
import { BannerResDTO } from "../../public/bannerData.dto.js";

export class FetchSelectedBannerDTO {
  @IsString()
  bannerId: string;
}

export interface ResFetchSelectedBannerDTO {
  message: string;
  success: boolean;
  banner:BannerResDTO | null;
}
