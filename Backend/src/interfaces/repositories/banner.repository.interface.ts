

export interface IBannerRepository<T> {
  findById(bannerId: string): Promise<T | null>;
  fetchBanners(): Promise<T[] | null>;
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
