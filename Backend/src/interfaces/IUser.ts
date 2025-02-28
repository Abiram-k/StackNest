import { Document, Types } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  userName: string;
  avatar: string;
  streak: number;
  streakClaimDate: Date;
  failedLoginAttempts:number;
  lastLogin: Date;
  friends: string[];
  isBlocked: boolean;
  blockedUntil:Date;
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
