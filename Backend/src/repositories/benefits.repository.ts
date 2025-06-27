import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface";
import { Benefit } from "../models/benefits.model";
import { IBenefit } from "../types/IBenefits";
import { BaseRepository } from "./base.repository";

export class BenefitsRepository
  extends BaseRepository<IBenefit>
  implements IBenefitsRepository<IBenefit>
{
  constructor() {
    super(Benefit);
  }
  async getAllBenefits(
    currentPage: number,
    limit: number
  ): Promise<{ benefits: IBenefit[]; totalPages: number }> {
    try {
      const totalBenefits = await Benefit.countDocuments();
      const totalPages = Math.floor(totalBenefits / limit);
      const benefits = await Benefit.find()
        .skip((currentPage - 1) * limit)
        .limit(limit);
      // return await Benefit.find();
      return { benefits, totalPages };
    } catch (error) {
      throw error;
    }
  }
  async getActiveBenefits(): Promise<IBenefit[]> {
    try {
      // return await Benefit.find({ isActive: true });
      return await this.findAll({ isActive: true });
    } catch (error) {
      throw error;
    }
  }

  async createBenefit(data: Partial<IBenefit>): Promise<void> {
    try {
      const isAlreadyExists = await this.findOne({ name: data.name });
      if (isAlreadyExists) throw new Error("Already added this benefit");
      await this.create(data);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndRemove(benefitId: string): Promise<void> {
    try {
      // await Benefit.findByIdAndDelete(benefitId);
      await this.deleteById(benefitId);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndUpdate(
    benefitId: string,
    data: Partial<IBenefit>
  ): Promise<void> {
    try {
      await this.updateById(benefitId, data);
      // await Benefit.findByIdAndUpdate(benefitId, data);
    } catch (error) {
      throw error;
    }
  }
  async getBenefitById(benefitId: string): Promise<IBenefit | null> {
    try {
      return await this.findById(benefitId);
      // return await Benefit.findById(benefitId);
    } catch (error) {
      throw error;
    }
  }

  async toggleList(benefitId: string): Promise<void> {
    try {
      const benefit = await this.findById(benefitId);
      // const benefit = await Benefit.findById(benefitId);
      await this.updateById(benefitId, {
        isActive: !benefit?.isActive,
      });
      // await Benefit.findByIdAndUpdate(benefitId, {
      //   isActive: !benefit?.isActive,
      // });
    } catch (error) {
      throw error;
    }
  }
}
