import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { Premium } from "../models/premium.model";
import { IPremium } from "../types/IPremium";

export class PremiumRepository implements IPremiumRepository<IPremium> {
  async getPremiumById(premiumId: string): Promise<IPremium | null> {
    try {
      return await Premium.findById(premiumId);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndUpdate(
    premiumId: string,
    data: Partial<IPremium>
  ): Promise<void> {
    try {
      await Premium.findByIdAndUpdate(premiumId, data);
    } catch (error) {
      throw error;
    }
  }
  async getAllPremium(): Promise<IPremium[]> {
    try {
      return await Premium.find();
    } catch (error) {
      throw error;
    }
  }
  async createPremium(data: Partial<IPremium>): Promise<void> {
    try {
      await Premium.create(data);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndRemove(premiumId: string): Promise<void> {
    try {
      await Premium.findByIdAndDelete(premiumId);
    } catch (error) {
      throw error;
    }
  }
  async toggleListPremium(premiumId: string): Promise<void> {
    try {
      const premium = await Premium.findById(premiumId);
      await Premium.findByIdAndUpdate(premiumId, {
        isListed: !premium?.isListed,
      });
    } catch (error) {
      throw error;
    }
  }
}
