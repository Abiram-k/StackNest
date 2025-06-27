import { typeUserResetToken } from "../dtos/auth/login.dto.js";
import { IUserAuthRepository } from "../interfaces/repositories/user.repository.interface.js";
import User from "../models/user.model.js";
import { IUser } from "../types/IUser.js";
import { BaseRepository } from "./base.repository.js";

export class UserAuthRespository
  extends BaseRepository<IUser>
  implements IUserAuthRepository<IUser>
{
  constructor() {
    super(User);
  }

  async findByGithubId(githubId: string) {
    // return User.findOne({ githubId });
    return this.model.findOne({ githubId });
  }

  async createOrUpdateFromGithub(profile: Partial<IUser>) {
    return User.findOneAndUpdate({ email: profile.email }, profile, {
      upsert: true,
      new: true,
    });
  }

  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      //   return await User.findOne({
      //     googleId,
      //   });
      return await this.model.findOne({ googleId });
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
