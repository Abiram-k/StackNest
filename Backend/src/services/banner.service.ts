import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface";
import { IBannerService } from "../interfaces/services/banner.service.interface";
import { IBanner } from "../types/IBanner";

export class BannerService implements IBannerService {
  private _bannerRepo: IBannerRepository;
  constructor(bannerRepo: IBannerRepository) {
    this._bannerRepo = bannerRepo;
  }
  async fetchBanners(): Promise<IBanner[]> {
    try {
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
    } catch (error) {
      throw error;
    }
  }
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
