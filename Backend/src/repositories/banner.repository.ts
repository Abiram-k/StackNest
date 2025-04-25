import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface.js";
import { IBanner } from "../types/IBanner.js";
import { Banner } from "../models/banner.model.js";

export class BannerRepository implements IBannerRepository<IBanner> {
  async findById(bannerId: string): Promise<IBanner | null> {
    try {
      return await Banner.findById(bannerId);
    } catch (error) {
      throw error;
    }
  }

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

  async fetchBanners(): Promise<IBanner[] | null> {
    try {
      return await Banner.find();
    } catch (error) {
      throw error;
    }
  }
  async removeBanner(bannerId: string): Promise<boolean> {
    try {
      const result = await Banner.findByIdAndDelete(bannerId);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async updateBanner(
    bannerId: string,
    title: string,
    description: string,
    image: string
  ): Promise<boolean> {
    try {
      await Banner.findByIdAndUpdate(bannerId, { title, description, image });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
