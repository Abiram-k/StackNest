import cron from "node-cron";
import { UserBaseRepository } from "../repositories/user.repository";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { premiumEndedMail } from "../utils/email";
import { Types } from "mongoose";

const userBaseRepository: IUserBaseRepository<IUser> = new UserBaseRepository();
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const users = await userBaseRepository.getAllPremiumUser();
  for (const user of users) {
    for (const plan of user.premiumHistory) {
      if (plan.endingDate <= now) {
        if (plan.premiumPlan instanceof Types.ObjectId)
          await userBaseRepository.premiumExpired(plan.premiumPlan, user._id);
        await premiumEndedMail(user.email, user.userName);
      }
    }
  }
});
