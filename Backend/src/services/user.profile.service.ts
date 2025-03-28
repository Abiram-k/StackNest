import { verifyUserProfileSchemaType } from "../../../types/user";
import { HttpStatus } from "../constants/enum.statusCode";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUserProfileService } from "../interfaces/services/user.profile.service.interface";
import { IUser } from "../types/IUser";
import { isSameDay } from "date-fns";
import createHttpError from "http-errors";

export class UserProfileService implements IUserProfileService {
  constructor(private _baseRepo: IUserBaseRepository<IUser>) {}

  async getUserDetails(id: string): Promise<verifyUserProfileSchemaType> {
    const user = await this._baseRepo.findById(id);
    if (!user) throw new Error("User not found");
    const data = {
      email: user.email,
      avatar: user.avatar,
      firstName: user.firstName,
      userName: user.userName,
      gender: user.gender,
      country: user.country,
      description: user.description,
      mobileNumber: user.mobileNumber,
      streak: user.streak,
      streakClaimDate: user.streakClaimDate,
    };
    return data;
  }

  async updateUserDetails(id: string, data: verifyUserProfileSchemaType) {
    const user = await this._baseRepo.findByUserName(data.userName);
    if (user && user.email != data.email)
      throw new Error("User name already exist");
    return await this._baseRepo.findByIdAndUpdate(id, data);
  }
  async checkinUser(userId: string): Promise<void> {
    const user = await this._baseRepo.findById(userId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
    }
    const currentDate = new Date();

    let isAlreadyCheckedIn = isSameDay(currentDate, user?.streakClaimDate);

    if (isAlreadyCheckedIn) {
      throw createHttpError(HttpStatus.FORBIDDEN, "Already checked in");
    }
    await this._baseRepo.incrementCheckin(userId);
  }

  async getUserStreakCount(userId: string): Promise<number | null> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.NOT_FOUND, "User id not founded");
      const user = await this._baseRepo.findById(userId);

      if (!user) throw createHttpError(HttpStatus.FORBIDDEN, "User not found");

      const currentDate = new Date();
      const LastStreamClaimDate = new Date(user.streakClaimDate);
      currentDate.setHours(0, 0, 0, 0);
      LastStreamClaimDate.setHours(0, 0, 0, 0);

      const timeDifferenceMs = Math.abs(
        LastStreamClaimDate.getTime() - currentDate.getTime()
      );
      const daysDifference = Math.ceil(
        timeDifferenceMs / (1000 * 60 * 60 * 24)
      );

      if (daysDifference > 1) {
        await this._baseRepo.resetCheckin(userId);
        return null;
      }
      return user.streak;
    } catch (error) {
      throw error;
    }
  }

  async getUserChallengePoints(userId: string): Promise<number | null> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.NOT_FOUND, "User id not founded");
      const user = await this._baseRepo.findById(userId);
      if (!user) throw createHttpError(HttpStatus.FORBIDDEN, "User not found");
      return user.challengePoints || 0;
    } catch (error) {
      throw error;
    }
  }
}
