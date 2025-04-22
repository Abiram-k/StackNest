import { HttpStatus } from "../constants/enum.statusCode";
import { PremiumResDto } from "../dtos/public/premiumData.dto";
import { IBenefitsRepository } from "../interfaces/repositories/benefits.repository.interface";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IPremiumService } from "../interfaces/services/premium.service.interface";
import { IBenefit } from "../types/IBenefits";
import { IPremium } from "../types/IPremium";
import createHttpError from "http-errors";
import { IUser } from "../types/IUser";
import { PremiumHistoryDTO } from "../dtos/user/premium/PremiumHistory.dto";
import { Types } from "mongoose";

export class PremiumService implements IPremiumService {
  private _premiumRepo: IPremiumRepository<IPremium>;
  private _benefitsRepo: IBenefitsRepository<IBenefit>;
  private _userRepo: IUserBaseRepository<IUser>;
  constructor(
    premiumRepo: IPremiumRepository<IPremium>,
    benefitsRepo: IBenefitsRepository<IBenefit>,
    userRepo: IUserBaseRepository<IUser>
  ) {
    this._premiumRepo = premiumRepo;
    this._benefitsRepo = benefitsRepo;
    this._userRepo = userRepo;
  }

  async getAllPremium(): Promise<PremiumResDto[]> {
    try {
      const premiumPlans = await this._premiumRepo.getAllPremium();
      const formattedData: PremiumResDto[] = premiumPlans.map((plan) => ({
        _id: String(plan._id),
        title: plan.title,
        description: plan.description,
        isExpired: plan.isExpired,
        discountAmount: plan.discountAmount,
        willExpireInDays: plan.willExpireInDays,
        periodInDays: plan.periodInDays,
        regularAmount: plan.regularAmount,
        benefits: plan.benefits,
        createdAt: plan.createdAt,
        isListed: plan.isListed,
        updatedAt: plan.updatedAt,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async getListedPremium(userId: string): Promise<PremiumResDto[]> {
    try {
      const listedPlans = await this._premiumRepo.getListedPremium(userId);
      const formattedData: PremiumResDto[] = listedPlans.map((plan) => ({
        _id: String(plan._id),
        title: plan.title,
        description: plan.description,
        discountAmount: plan.discountAmount,
        willExpireInDays: plan.willExpireInDays,
        isExpired: plan.isExpired,
        periodInDays: plan.periodInDays,
        regularAmount: plan.regularAmount,
        benefits: plan.benefits,
        createdAt: plan.createdAt,
        isListed: plan.isListed,
        updatedAt: plan.updatedAt,
      }));
      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async getSelectedPremium(premiumId: string): Promise<PremiumResDto | null> {
    try {
      const premiumPlan = await this._premiumRepo.getPremiumById(premiumId);
      if (!premiumPlan) return null;
      const formattedData: PremiumResDto = {
        _id: String(premiumPlan._id),
        title: premiumPlan.title,
        description: premiumPlan.description,
        discountAmount: premiumPlan.discountAmount,
        willExpireInDays: premiumPlan.willExpireInDays,
        isExpired: premiumPlan.isExpired,
        regularAmount: premiumPlan.regularAmount,
        periodInDays: premiumPlan.periodInDays,
        benefits: premiumPlan.benefits,
        createdAt: premiumPlan.createdAt,
        isListed: premiumPlan.isListed,
        updatedAt: premiumPlan.updatedAt,
      };
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
  async addPremium(data: Partial<IPremium>): Promise<void> {
    try {
      await this._premiumRepo.createPremium(data);
    } catch (error) {
      throw error;
    }
  }
  async updatePremium(
    premiumId: string,
    data: Partial<IPremium>
  ): Promise<void> {
    try {
      if (!premiumId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Premium id not founded");
      await this._premiumRepo.findByIdAndUpdate(premiumId, data);
    } catch (error) {
      throw error;
    }
  }
  async toggleListPremium(premiumId: string): Promise<void> {
    try {
      if (!premiumId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Premium id not founded");
      this._premiumRepo.toggleListPremium(premiumId);
    } catch (error) {
      throw error;
    }
  }
  async removePremium(premiumId: string): Promise<void> {
    try {
      if (!premiumId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Premium id not founded");
      this._premiumRepo.findByIdAndRemove(premiumId);
    } catch (error) {
      throw error;
    }
  }

  async getPremiumHistory(userId: string): Promise<PremiumHistoryDTO[]> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "Userid not founded");
      const user = await this._userRepo.getUserForPremiumHistory(userId);
      if (!user)
        throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");

      const premiumHistory = user.premiumHistory;
      const formattedData: PremiumHistoryDTO[] = premiumHistory
        .map((history) => {
          if (history.premiumPlan instanceof Types.ObjectId) return null;
          let planDetails = history.premiumPlan;
          return {
            status: history.status,
            startingDate: history.startingDate.toISOString(),
            endingDate: history.endingDate.toISOString(),
            plan: {
              _id: planDetails._id,
              benefits: planDetails.benefits,
              discountAmount: planDetails.discountAmount,
              regularAmount: planDetails.regularAmount,
              description: planDetails.description,
              title: planDetails.title,
            },
          };
        })
        .filter((data) => data != null);
      return formattedData;
    } catch (error) {
      throw error;
    }
  }
}
