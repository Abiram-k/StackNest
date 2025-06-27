import { PushSubscription } from "web-push";
import { IUser } from "../../types/IUser.js";
import { IPremiumHistory } from "../../types/IPremiumHistory.js";
import { ClientSession, Types } from "mongoose";
import { typeUserResetToken } from "../../dtos/auth/login.dto.js";
import { verifyUserProfileSchemaType } from "../../dtos/user/profile/getInspectData.dto.js";

export interface IUserBaseRepository<T> {
  create(userData: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  pushNewSubscription(
    subscription: PushSubscription,
    userId: string
  ): Promise<void>;
  isAlreadyFreind(
    recieverId: Types.ObjectId,
    freindId: Types.ObjectId
  ): Promise<boolean>;
  claimReward(
    userId: string,
    rewardId: string,
    redeemPoint: number,
    benefitKey: string
  ): Promise<void>;
  removeFreind(userId: string, friendId: string): Promise<void>;
  addNewFriend(userId: Types.ObjectId, friendId: Types.ObjectId): Promise<void>;
  getStreakTableData(): Promise<T[]>;
  getPointsTableData(): Promise<T[]>;
  fetchAllUserNameExceptUser(userId: string): Promise<T[] | null>;
  findByEmail(email: string): Promise<T | null>;
  findByIdAndUpdate(id: string, data: any): Promise<T | null>;
  findByUserName(userName: string): Promise<T | null>;
  incrementCheckin(userId: string): Promise<boolean>;
  incrementChallengePoint(userId: string): Promise<void>;
  getStreakCount(userId: string): Promise<number | undefined>;
  resetCheckin(userId: string): Promise<boolean>;
  getAllFriends(userId: string, search: string): Promise<T | null>;
  premiumExpired(
    planId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<boolean>;
  subscribePremium(
    userId: string,
    paymentData: IPremiumHistory,
    benefitData: { planId: string; benefitKeys: string[]; redeemedAt: Date },
    session: ClientSession
  ): Promise<void>;
  getAllPremiumUser(): Promise<T[]>;
  getUserForPremiumHistory(userId: string): Promise<T | null>;
}
export interface IUserAuthRepository<T> {
  updateUserWithGoogleId(email: string, googleId: string): Promise<boolean>;
  findUserByGoogleId(googleId: string): Promise<T | null>;
  findUserByRestToken(data: typeUserResetToken): Promise<T | null>;

  findByGithubId(githubId: string): Promise<T | null>;
  createOrUpdateFromGithub(profile: Partial<T>): Promise<T>;

  getFailedAttempts(email: string): Promise<number | undefined>;

  updateFailedAttempts(email: string): Promise<T | null>;

  blockUserAfterFailedAttempt(email: string): Promise<T>;

  resetFailedAttempts(email: string): Promise<T | null>;

  updateLastLogin(email: string): Promise<void>;
  updatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean>;
  setPassResetToken({
    email,
    resetToken,
  }: {
    email: string;
    resetToken: string;
  }): Promise<boolean>;
}

export interface IUserRepository {
  findByIdAndUpdate(
    id: string,
    data: verifyUserProfileSchemaType
  ): Promise<IUser | null>;

  findUserByGoogleId(googleId: string): Promise<IUser | null>;

  updateUserWithGoogleId(email: string, googleId: string): Promise<boolean>;

  create(userData: Partial<IUser>): Promise<IUser>;

  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  setPassResetToken({
    email,
    resetToken,
  }: {
    email: string;
    resetToken: string;
  }): Promise<boolean>;
  updatePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean>;

  findUserByRestToken(data: typeUserResetToken): Promise<IUser | null>;

  getFailedAttempts(email: string): Promise<number | undefined>;

  updateFailedAttempts(email: string): Promise<IUser | null>;

  blockUserAfterFailedAttempt(
    email: string,
    blockDuration: number
  ): Promise<IUser>;

  resetFailedAttempts(email: string): Promise<IUser | null>;

  updateLastLogin(email: string): Promise<void>;
}
