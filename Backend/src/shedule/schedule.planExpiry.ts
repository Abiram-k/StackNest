import cron from "node-cron";
import { PremiumRepository } from "../repositories/premium.repository";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IPremium } from "../types/IPremium";

cron.schedule("* * * * *", async () => {
  try {
    const premiumRepository: IPremiumRepository<IPremium> =
      new PremiumRepository();
    const plans = await premiumRepository.getAllPremium();
    const now = new Date().getTime();

    plans.forEach(async (plan) => {
      const createdAt = new Date(plan.createdAt).getTime();
      const durationInMs = plan.willExpireInDays * 24 * 60 * 60 * 1000;
      const endTime = createdAt + durationInMs;
      if (now > endTime) {
        await premiumRepository.markAsExpired(plan._id);
      }
    });
  } catch (error) {
    console.error("Error in premium plan cron job:", error);
  }
});
