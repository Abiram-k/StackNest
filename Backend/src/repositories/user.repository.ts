import { typeUserResetToken } from "../../../types/user";
import { IOTP } from "../interfaces/IOtp";
import Otp from "../models/otp.model";
import User from "../models/user.model";

class UserRepository {
  async findUserByGoogleId(googleId: string) {
    try {
      return await User.findOne({
        googleId,
      });
    } catch (error) {
      throw error;
    }
  }
  async updateUserWithGoogleId(email: string, googleId: string) {
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
  async findOneByEmail(email: string) {
    try {
      return await User.findOne({
        email,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(userData: any) {
    try {
      return await User.create(userData);
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
  }) {
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
  }) {
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
  async findUserByRestToken(data: typeUserResetToken) {
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

  async getFailedAttempts(email: string) {
    try {
      const user = await User.findOne({ email });
      return user?.failedLoginAttempts;
    } catch (error) {
      throw error;
    }
  }
  async updateFailedAttempts(email: string) {
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

  async resetFailedAttempts(email: string) {
    try {
      return await User.findOneAndUpdate({ email }, { failedLoginAttempts: 0 });
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
