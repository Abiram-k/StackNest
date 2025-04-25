import { HttpStatus } from "../constants/enum.statusCode.js";
import { BenefitResDto } from "../dtos/public/benefitData.dto.js";
import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface.js";
import { IBenefitsService } from "../interfaces/services/benefits.service.interface.js";
import { IBenefit } from "../types/IBenefits.js";
import createHttpError from "http-errors";

export class BenefitsService implements IBenefitsService {
  private _benefitsRepo: IBenefitsRepository<IBenefit>;
  constructor(benefitsRepo: IBenefitsRepository<IBenefit>) {
    this._benefitsRepo = benefitsRepo;
  }

  async getAllBenefits(): Promise<BenefitResDto[]> {
    try {
      const benefits = await this._benefitsRepo.getAllBenefits();
      const formattedData: BenefitResDto[] = benefits.map((benefit) => ({
        _id: benefit._id,
        description: benefit.description,
        isActive: benefit.isActive,
        name: benefit.name,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async getActiveBenefits(): Promise<Partial<BenefitResDto>[]> {
    try {
      const activeBenefits = await this._benefitsRepo.getActiveBenefits();
      const formattedData = activeBenefits.map((benefit) => ({
        _id: benefit._id,
        name: benefit.name,
        description: benefit.description,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async getSelectedBenefits(
    benefitId: string
  ): Promise<Partial<BenefitResDto>> {
    try {
      if (!benefitId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Benefit id not found");
      const benefit = await this._benefitsRepo.getBenefitById(benefitId);
      if (!benefit)
        throw createHttpError(HttpStatus.NOT_FOUND, "Benefit not found");
      const formattedData = {
        description: benefit.description,
        name: benefit.name,
      };
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async addBenefits(data: Partial<IBenefit>): Promise<void> {
    try {
      await this._benefitsRepo.createBenefit(data);
    } catch (error) {
      throw error;
    }
  }
  async updateBenefits(
    benefitId: string,
    data: Partial<IBenefit>
  ): Promise<void> {
    try {
      if (!benefitId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Benefit id not found");
      await this._benefitsRepo.findByIdAndUpdate(benefitId, data);
    } catch (error) {
      throw error;
    }
  }
  async toggleListing(benefitId: string): Promise<void> {
    try {
      if (!benefitId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Benefit id not found");
      await this._benefitsRepo.toggleList(benefitId);
    } catch (error) {
      throw error;
    }
  }
  async removeBenefits(benefitId: string): Promise<void> {
    try {
      if (!benefitId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Benefit id not found");
      await this._benefitsRepo.findByIdAndRemove(benefitId);
    } catch (error) {
      throw error;
    }
  }
}
