import cron from "node-cron";
import { UserBaseRepository } from "../repositories/user.repository.js";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface.js";
import { IUser } from "../types/IUser.js";
import { premiumEndedMail } from "../utils/email.js";
import { Types } from "mongoose";

const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  const users = await userBaseRepository.getAllPremiumUser();
  for (const user of users) {
    for (const plan of user.premiumHistory) {
      if (plan.endingDate <= now) {
        if (plan.premiumPlan instanceof Types.ObjectId) {
          const isAlreadyNotExpired = await userBaseRepository.premiumExpired(
            plan.premiumPlan,
            user._id
          );
          if (isAlreadyNotExpired)
            await premiumEndedMail(user.email, user.userName);
        }
      }
    }
  }
});
