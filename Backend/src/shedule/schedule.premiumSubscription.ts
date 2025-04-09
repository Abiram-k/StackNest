import cron from "node-cron";
import { UserBaseRepository } from "../repositories/user.repository";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { premiumEndedMail } from "../utils/email";

const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  console.log("Checking for premium ended users...");
  const users = await userBaseRepository.getAllPremiumUser();
  for (const user of users) {
    for (const plan of user.premiumHistory) {
      if (plan.endingDate <= now) {
        await userBaseRepository.premiumExpired(plan.premiumPlan, user._id);
        await premiumEndedMail(user.email, user.userName);
      }
    }
  }
});
