import { BenefitResDto } from "../../dtos/public/benefitData.dto";
import { IBenefit } from "../../types/IBenefits";

export interface IBenefitsService {
  addBenefits(data: Partial<IBenefit>): Promise<void>;
  getAllBenefits(
    currentPage: number,
    limit: number
  ): Promise<{ benefits: BenefitResDto[]; totalPages: number }>;
  getActiveBenefits(): Promise<Partial<BenefitResDto>[]>;
  getSelectedBenefits(benefitId: string): Promise<Partial<BenefitResDto>>;
  updateBenefits(benefitId: string, data: Partial<IBenefit>): Promise<void>;
  toggleListing(benefitId: string): Promise<void>;
  removeBenefits(benefitId: string): Promise<void>;
}
