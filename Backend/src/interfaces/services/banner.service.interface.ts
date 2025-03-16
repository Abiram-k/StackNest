import { IBanner } from "../../types/IBanner";

export interface IBannerService {
  fetchBanners(): Promise<IBanner[] | null>;
  fetchSelectedBanner(bannerId: string): Promise<IBanner | null>;
  addNewBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean>;
  removeBanner(bannerId: string): Promise<boolean>;
  updateBanner(
    bannerId: string,
    title: string,
    description: string,
    image: string
  ): Promise<boolean>;
}
