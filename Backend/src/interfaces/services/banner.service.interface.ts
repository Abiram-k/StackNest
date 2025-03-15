import { IBanner } from "../../types/IBanner";

export interface IBannerService {
  fetchBanners(): Promise<IBanner[]>;
  addNewBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean>;
  removeBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean>;
  updateBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean>;
}
