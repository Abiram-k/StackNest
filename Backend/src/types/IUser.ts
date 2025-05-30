import { Document, Types } from "mongoose";
import { IPremium } from "./IPremium";

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
export interface IUser extends Document {
  _id: Types.ObjectId;
  googleId: string;
  githubId: string;
  firstName: string;
  email: string;
  password: string;
  country: string;
  description: string;
  gender?: "Male" | "Female" | "Others";
  mobileNumber: string;
  role: "user" | "admin";
  userName: string;
  avatar: string;
  pushSubscriptions: PushSubscription[];
  streak: number;
  streakClaimDate: Date;
  failedLoginAttempts: number;
  challengePoints: number;
  lastLogin: Date;
  rewards: {
    rewardId: Types.ObjectId;
    benefitKey: string;
    redeemedAt: Date;
    isExpired: boolean;
  }[];
  premiumBenefits: {
    planId: Types.ObjectId;
    benefitKeys: [string];
    redeemedAt: Date;
    isExpired: boolean;
  }[];
  friends: string[] | { firstName: string; userName: string; avatar: string }[];
  isBlocked: boolean;
  blockedUntil: Date;
  isVerified: boolean;
  premiumHistory: {
    status: "active" | "expired" | "pending";
    startingDate: Date;
    endingDate: Date;
    premiumPlan: Types.ObjectId | IPremium;
    createdAt: Date;
    updatedAt: Date;
  }[];
  resetToken: string;
  resetTokenExpiration: Date;
  createdAt: Date;
  updatedAt: Date;
}
