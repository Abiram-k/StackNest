import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
import { IBanner } from "../../types/IBanner";

export interface IBannerRepository {
  fetchFavorites(userId: string): Promise<IBanner[] | null>;
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
