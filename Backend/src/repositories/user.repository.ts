import {
  typeUserResetToken,
  verifyUserProfileSchemaType,
} from "../../../types/user";
import User from "../models/user.model";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUser } from "../types/IUser";

export class UserRepository implements IUserRepository {
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

  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      console.log("Hey req from repo google create user");
      const user = await User.create(userData);
      console.log("From repository", user);
      return user;
    } catch (error) {
      throw error;
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

  async findByIdAndUpdate(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<IUser | null> {
    try {

      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields provided for update.");
      }
      console.log(filteredData);

      return await User.findByIdAndUpdate(id, filteredData, {
        upsert: true,
        new: true,
      });

    } catch (error) {
      throw error;
    }
  }
}
