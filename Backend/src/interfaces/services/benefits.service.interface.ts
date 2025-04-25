import { BenefitResDto } from "../../dtos/public/benefitData.dto.js";
import { IBenefit } from "../../types/IBenefits.js";

export interface IBenefitsService {
  addBenefits(data: Partial<IBenefit>): Promise<void>;
  getAllBenefits(): Promise<BenefitResDto[]>;
  getActiveBenefits(): Promise<Partial<BenefitResDto>[]>;
  getSelectedBenefits(benefitId: string): Promise<Partial<BenefitResDto>>;
  updateBenefits(benefitId: string, data: Partial<IBenefit>): Promise<void>;
  toggleListing(benefitId: string): Promise<void>;
  removeBenefits(benefitId: string): Promise<void>;
}
