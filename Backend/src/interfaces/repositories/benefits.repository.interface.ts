export interface IBenefitsRepository<T> {
  getAllBenefits(): Promise<T[]>;
  getBenefitById(benefitId: string): Promise<T | null>;
  getActiveBenefits():Promise<T[]>
  createBenefit(data: Partial<T>): Promise<void>;
  findByIdAndUpdate(benefitId: string,data:Partial<T>): Promise<void>;
  toggleList(benefitId: string): Promise<void>;
  findByIdAndRemove(benefitId: string): Promise<void>;
}
