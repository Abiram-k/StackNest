export interface IPremiumRepository<T> {
  getAllPremium(): Promise<T[]>;
  getListedPremium(): Promise<T[]>;
  getPremiumById(premiumId: string): Promise<T | null>;
  createPremium(data: Partial<T>): Promise<void>;
  markAsExpired(premiumId: string): Promise<void>;
  findByIdAndUpdate(premiumId: string, data: Partial<T>): Promise<void>;
  toggleListPremium(premiumId: string): Promise<void>;
  findByIdAndRemove(premiumId: string): Promise<void>;
}
