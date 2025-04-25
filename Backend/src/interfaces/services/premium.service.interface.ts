import { PremiumResDto } from "../../dtos/public/premiumData.dto.js";
import { PremiumHistoryDTO } from "../../dtos/user/premium/PremiumHistory.dto.js";
import { IPremium } from "../../types/IPremium.js";

export interface IPremiumService {
  getAllPremium(): Promise<PremiumResDto[]>;
  getListedPremium(userId:string): Promise<PremiumResDto[]>;
  getPremiumHistory(userId:string): Promise<PremiumHistoryDTO[]>;
  getSelectedPremium(premiumId:string): Promise<PremiumResDto | null>;
  addPremium(data: Partial<IPremium>): Promise<void>;
  updatePremium(premiumId: string, data: Partial<IPremium>): Promise<void>;
  removePremium(premiumId: string): Promise<void>;
  toggleListPremium(premiumId: string): Promise<void>;
}
