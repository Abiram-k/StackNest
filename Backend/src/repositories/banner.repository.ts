import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface";
import { IBanner } from "../types/IBanner";
import { Banner } from "../models/banner.model";
import { BaseRepository } from "./base.repository";

export class BannerRepository
  extends BaseRepository<IBanner>
  implements IBannerRepository<IBanner>
{
  constructor() {
    super(Banner);
  }

  async findById(bannerId: string): Promise<IBanner | null> {
    try {
      return await this.model.findById(bannerId);
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
      // await Banner.create({ title, description, image });
      await this.create({ title, description, image });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async fetchBanners(): Promise<IBanner[] | null> {
    try {
      // return await Banner.find();
      return await this.findAll();
    } catch (error) {
      throw error;
    }
  }
  async removeBanner(bannerId: string): Promise<boolean> {
    try {
      // const result = await Banner.findByIdAndDelete(bannerId);
      await this.deleteById(bannerId);
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
      // await Banner.findByIdAndUpdate(bannerId, { title, description, image });
      await this.updateById(bannerId, { title, description, image });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
