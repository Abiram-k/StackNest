import { Document, Types } from "mongoose";

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
  rewards: { rewardId: Types.ObjectId; benefitKey: string; redeemedAt: Date }[];
  friends: string[];
  isBlocked: boolean;
  blockedUntil: Date;
  isVerified: boolean;
  premiumHistory: {
    status: "active" | "expired" | "pending";
    startingDate: Date;
    endingDate: Date;
    premiumPlan: Types.ObjectId;
  }[];
  resetToken: string;
  resetTokenExpiration: Date;
  createdAt: Date;
  updatedAt: Date;
}
