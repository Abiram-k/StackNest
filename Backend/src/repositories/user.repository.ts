import { typeUserResetToken } from "../../../types/user";
import User from "../models/user.model";
import {
  IUserAuthRepository,
  IUserBaseRepository,
} from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { PushSubscription } from "web-push";

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
  async fetchAllUserNameExceptUser(userId: string): Promise<IUser[] | null> {
    try {
      const query: any = {
        _id: { $ne: userId },
      };

      return await User.find(query).select("userName -_id");
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
