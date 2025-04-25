import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface.js";
import { Premium } from "../models/premium.model.js";
import User from "../models/user.model.js";
import { IPremium } from "../types/IPremium.js";

export class PremiumRepository implements IPremiumRepository<IPremium> {
  async getPremiumById(premiumId: string): Promise<IPremium | null> {
    try {
      return await Premium.findOne({
        _id: premiumId,
        isListed: true,
        isExpired: false,
      });
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
  async markAsExpired(premiumId: string): Promise<void> {
    try {
      const updated = await Premium.findByIdAndUpdate(
        premiumId,
        { isExpired: true },
        { new: true }
      );

      if (!updated) {
        throw new Error("Premium not found to mark as expired");
      }
    } catch (error) {
      throw new Error(`Failed to mark premium as expired`);
    }
  }

  async getAllPremium(): Promise<IPremium[]> {
    try {
      return await Premium.find();
    } catch (error) {
      throw error;
    }
  }

  async getListedPremium(userId: string): Promise<IPremium[]> {
    try {
      const now = new Date();
      const user = await User.findById(userId);
      const alreadySubscribedPlans = user?.premiumBenefits.map(
        (benefit) => benefit.planId
      );
      return await Premium.find({
        isListed: true,
        isExpired: false,
        _id: { $nin: alreadySubscribedPlans },
        $expr: {
          $gte: [
            {
              $add: [
                "$createdAt",
                { $multiply: ["$willExpireInDays", 24 * 60 * 60 * 1000] },
              ],
            },
            now,
          ],
        },
      });
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
