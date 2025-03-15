import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface";
import { IBanner } from "../types/IBanner";
import { Banner } from "../models/banner.model";

export class BannerRepository implements IBannerRepository {
  async addNewBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean> {
    try {
      await Banner.create({ title, description, image });
      return true;
    } catch (error) {
      throw error;
    }
  }
  async fetchFavorites(userId: string): Promise<IBanner[] | null> {}
  async removeBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean> {
    try {
    } catch (error) {
      throw error;
    }
  }
  async updateBanner(
    title: string,
    description: string,
    image: string
  ): Promise<boolean> {
    try {
    } catch (error) {
      throw error;
    }
  }
}
