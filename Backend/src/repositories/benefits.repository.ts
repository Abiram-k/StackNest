import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface.js";
import { Benefit } from "../models/benefits.model.js";
import { IBenefit } from "../types/IBenefits.js";

export class BenefitsRepository implements IBenefitsRepository<IBenefit> {
  async getAllBenefits(): Promise<IBenefit[]> {
    try {
      return await Benefit.find();
    } catch (error) {
      throw error;
    }
  }
  async getActiveBenefits(): Promise<IBenefit[]> {
    try {
      return await Benefit.find({ isActive: true });
    } catch (error) {
      throw error;
    }
  }

  async createBenefit(data: Partial<IBenefit>): Promise<void> {
    try {
      await Benefit.create(data);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndRemove(benefitId: string): Promise<void> {
    try {
      await Benefit.findByIdAndDelete(benefitId);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndUpdate(
    benefitId: string,
    data: Partial<IBenefit>
  ): Promise<void> {
    try {
      await Benefit.findByIdAndUpdate(benefitId, data);
    } catch (error) {
      throw error;
    }
  }
  async getBenefitById(benefitId: string): Promise<IBenefit | null> {
    try {
      return await Benefit.findById(benefitId);
    } catch (error) {
      throw error;
    }
  }

  async toggleList(benefitId: string): Promise<void> {
    try {
      const benefit = await Benefit.findById(benefitId);
      await Benefit.findByIdAndUpdate(benefitId, {
        isActive: !benefit?.isActive,
      });
    } catch (error) {
      throw error;
    }
  }
}
