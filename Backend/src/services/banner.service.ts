import createHttpError from "http-errors";
import { IBannerRepository } from "../interfaces/repositories/banner.repository.interface.js";
import { IBannerService } from "../interfaces/services/banner.service.interface.js";
import { IBanner } from "../types/IBanner.js";
import { HttpStatus } from "../constants/enum.statusCode.js";

export class BannerService implements IBannerService {
  private _bannerRepo: IBannerRepository<IBanner>;
  constructor(bannerRepo: IBannerRepository<IBanner>) {
    this._bannerRepo = bannerRepo;
  }
  async fetchSelectedBanner(bannerId: string): Promise<IBanner | null> {
    try {
      const banner = await this._bannerRepo.findById(bannerId);
      if (!banner) console.log("No banner founded with this id specified!");
      return banner;
    } catch (error) {
      throw error;
    }
  }
  async fetchBanners(): Promise<IBanner[] | null> {
    try {
      const banners = await this._bannerRepo.fetchBanners();
      if (!banners) {
        console.log("No banner founded!");
        return null;
      }
      return banners;
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
      if (!title || !description || !image) {
        console.log("Title | description | image is missing");
        return false;
      }

      const isCreated = await this._bannerRepo.addNewBanner(
        title,
        description,
        image
      );

      if (!isCreated)
        throw createHttpError(HttpStatus.FORBIDDEN, "Failed to add banner");
      return true;
    } catch (error) {
      throw error;
    }
  }
  async removeBanner(bannerId: string): Promise<boolean> {
    try {
      if (!bannerId) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Banner Id not founded");
      }
      const isDeleted = await this._bannerRepo.removeBanner(bannerId);
      return isDeleted;
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
      if (!bannerId) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Banner Id not founded");
      }
      if (!title || !description || !image) {
        console.log("title | description | image, is missing!");
        return false;
      }
      const isUpdated = await this._bannerRepo.updateBanner(
        bannerId,
        title,
        description,
        image
      );
      return isUpdated;
    } catch (error) {
      throw error;
    }
  }
}
