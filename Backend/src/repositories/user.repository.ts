import User from "../models/user.model.js";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface.js";
import { IUser } from "../types/IUser.js";
import { PushSubscription } from "web-push";
import { IPremiumHistory } from "../types/IPremiumHistory.js";
import { Types } from "mongoose";
import { typeUserResetToken } from "../dtos/auth/login.dto.js";

export class UserBaseRepository implements IUserBaseRepository<IUser> {
  async incrementCheckin(userId: string): Promise<boolean> {
    try {
      await User.findByIdAndUpdate(userId, {
        streakClaimDate: new Date(),
        $inc: { streak: 1 },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getStreakCount(userId: string): Promise<number | undefined> {
    try {
      const user = await User.findById(userId);
      return user?.streak;
    } catch (error) {
      throw error;
    }
  }
  async claimReward(
    userId: string,
    rewardId: string,
    redeemPoint: number,
    benefitKey: string
  ): Promise<void> {
    try {
      const rewardData = {
        rewardId,
        benefitKey,
      };
      await User.findByIdAndUpdate(userId, {
        $inc: { challengePoints: -redeemPoint },
        $push: { rewards: rewardData },
      });
    } catch (error) {
      throw error;
    }
  }

  async getStreakTableData(): Promise<IUser[]> {
    try {
      const user = await User.find({
        role: { $ne: "admin" },
        streak: { $gte: 1 },
      })
        .sort({ streak: -1 })
        .limit(10)
        .select("-_id userName avatar streak");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async addNewFriend(
    userId: Types.ObjectId,
    friendId: Types.ObjectId
  ): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
    } catch (error) {
      throw error;
    }
  }

  async removeFreind(userId: string, friendId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    } catch (error) {
      throw error;
    }
  }

  async isAlreadyFreind(
    recieverId: Types.ObjectId,
    freindId: Types.ObjectId
  ): Promise<boolean> {
    try {
      const user = await User.findById(recieverId);
      if (!user) {
        throw new Error("Failed to find user (checking already friend)");
      }
      const friends = user.friends;
      return friends.some((friend) => friend == String(freindId));
    } catch (error) {
      throw error;
    }
  }
  async getPointsTableData(): Promise<IUser[]> {
    try {
      const user = await User.find({
        role: { $ne: "admin" },
        challengePoints: { $gte: 1 },
      })
        .sort({ challengePoints: -1 })
        .limit(10)
        .select("-_id userName avatar challengePoints");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllPremiumUser(): Promise<IUser[]> {
    try {
      return await User.find({ isVerified: true });
    } catch (error) {
      throw error;
    }
  }

  async getUserForPremiumHistory(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId)
        .populate({
          path: "premiumHistory.premiumPlan",
        })
        .select("premiumHistory -_id");
    } catch (error) {
      throw error;
    }
  }

  async premiumExpired(
    planId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            premiumBenefits: { planId },
          },
        },
        { new: true }
      );
      if (!user) throw new Error("Failed to update user premium");

      const isAlreadyExpired = user.premiumHistory.some((history) => {
        return (
          history.status === "expired" &&
          history.premiumPlan.toString() === planId.toString()
        );
      });

      if (isAlreadyExpired) return false;

      user.premiumHistory = user.premiumHistory.map((history) => {
        const plan = history.premiumPlan;

        if (
          typeof plan === "object" &&
          "_id" in plan &&
          (plan._id as Types.ObjectId).toString() === planId.toString()
        ) {
          return {
            ...history,
            status: "expired",
          };
        }

        if (
          typeof plan === "object" &&
          !("_id" in plan) &&
          (plan as Types.ObjectId).toString() === planId.toString()
        ) {
          return {
            ...history,
            status: "expired",
          };
        }

        return history;
      });

      await user.save();

      if (user.premiumBenefits.length === 0) {
        await User.findByIdAndUpdate(userId, { isVerified: false });
      }
      return true
    } catch (error) {
      throw error;
    }
  }

  async subscribePremium(
    userId: string,
    paymentData: IPremiumHistory,
    benefitData: { planId: string; benefitKeys: string[]; redeemedAt: Date }
  ): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          premiumHistory: paymentData,
          premiumBenefits: benefitData,
        },
        $set: { isVerified: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async fetchAllUserNameExceptUser(userId: string): Promise<IUser[] | null> {
    try {
      const query: any = {
        _id: { $ne: userId },
        role: "user",
      };

      return await User.find(query);
    } catch (error) {
      throw error;
    }
  }
  async resetCheckin(userId: string): Promise<boolean> {
    await this.findByIdAndUpdate(userId, { streak: 0 });
    return true;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({
        email,
      });
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).select("-password");
    } catch (error) {
      throw error;
    }
  }

  async pushNewSubscription(
    subscription: PushSubscription,
    userId: string
  ): Promise<void> {
    try {
      const subscribeData = {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      };
      await User.findByIdAndUpdate(userId, {
        $push: { pushSubscriptions: subscribeData },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUserName(userName: string): Promise<IUser | null> {
    try {
      return await User.findOne({ userName });
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdate(
    id: string,
    data: Partial<IUser>
    // verifyUserProfileSchemaType
  ): Promise<IUser | null> {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields provided for update.");
      }

      return await User.findByIdAndUpdate(id, filteredData, {
        upsert: true,
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async incrementChallengePoint(userId: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { $inc: { challengePoints: 1 } });
    } catch (error) {
      throw error;
    }
  }

  // Connections
  async getAllFriends(userId: string, search: string): Promise<IUser | null> {
    try {
      // return await User.findOne({
      //   _id: userId,
      //   // userName: { $regex: search, $options: "i" },
      // }).populate("friends");
      // // .select("-_id friends");
      const user = await User.findById(userId).populate({
        path: "friends",
        match: {
          userName: { $regex: search, $options: "i" }, // filters friends by username
        },
        // select: "userName avatar email", // optional: only select needed fields
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export class UserAuthRespository implements IUserAuthRepository<IUser> {
  async findByGithubId(githubId: string) {
    return User.findOne({ githubId });
  }
  async createOrUpdateFromGithub(profile: Partial<IUser>) {
    return User.findOneAndUpdate({ email: profile.email }, profile, {
      upsert: true,
      new: true,
    });
  }
  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      return await User.findOne({
        googleId,
      });
    } catch (error) {
      throw error;
    }
  }
  async updateUserWithGoogleId(
    email: string,
    googleId: string
  ): Promise<boolean> {
    try {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            googleId,
          },
        },
        { new: true }
      );
      return true;
    } catch (error) {
      console.error("Error setting reset token:", error);
      throw new Error("Failed to set reset token");
    }
  }

  async updateLastLogin(email: string) {
    try {
      await User.findOneAndUpdate(
        { email },
        { $set: { lastLogin: new Date() } }
      );
    } catch (error) {
      throw error;
    }
  }

  async setPassResetToken({
    email,
    resetToken,
  }: {
    email: string;
    resetToken: string;
  }): Promise<boolean> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            resetToken,
            resetTokenExpiration: new Date(Date.now() + 15 * 60 * 1000),
          },
        },
        { new: true }
      );
      return true;
    } catch (error) {
      console.error("Error setting reset token:", error);
      throw new Error("Failed to set reset token");
    }
  }
  async updatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            password,
            resetToken: undefined,
            resetTokenExpiration: undefined,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Failed to update password:", error);
      throw new Error("Failed to update password");
    }
  }
  async findUserByRestToken(data: typeUserResetToken): Promise<IUser | null> {
    try {
      return User.findOne({
        _id: data.id,
        resetToken: data.resetToken,
        resetTokenExpiration: { $gt: new Date() },
      });
    } catch (error) {
      throw new Error("Failed to reset password and token");
    }
  }

  async getFailedAttempts(email: string): Promise<number | undefined> {
    try {
      const user = await User.findOne({ email });
      return user?.failedLoginAttempts;
    } catch (error) {
      throw error;
    }
  }
  async updateFailedAttempts(email: string): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        {
          $inc: {
            failedLoginAttempts: 1,
          },
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async resetFailedAttempts(email: string): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        { failedLoginAttempts: 0, isBlocked: false, blockedUntil: null }
      );
    } catch (error) {
      throw error;
    }
  }

  async blockUserAfterFailedAttempt(email: string): Promise<IUser> {
    try {
      const user = await User.findOneAndUpdate(
        { email },
        {
          isBlocked: true,
          blockedUntil: new Date(Date.now() + 30 * 60 * 1000),
        },
        { new: true }
      );
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }
}
