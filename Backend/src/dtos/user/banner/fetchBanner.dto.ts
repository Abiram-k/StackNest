export interface UserBannerDTO {
  title: string;
  description: string;
  image: string;
}

export interface ResFetchBannerDTO {
  message: string;
  success: boolean;
  banners: UserBannerDTO[] | null;
}
