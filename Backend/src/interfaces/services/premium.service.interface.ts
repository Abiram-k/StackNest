import { PremiumResDto } from "../../dtos/public/premiumData.dto";
import { IPremium } from "../../types/IPremium";

export interface IPremiumService {
  getAllPremium(): Promise<PremiumResDto[]>;
  getListedPremium(userId:string): Promise<PremiumResDto[]>;
  getSelectedPremium(premiumId:string): Promise<PremiumResDto | null>;
  addPremium(data: Partial<IPremium>): Promise<void>;
  updatePremium(premiumId: string, data: Partial<IPremium>): Promise<void>;
  removePremium(premiumId: string): Promise<void>;
  toggleListPremium(premiumId: string): Promise<void>;
}
