import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id:Types.ObjectId;
  googleId: string;
  githubId: string;
  firstName: string;
  email: string;
  password: string;
  country:string;
  description:string;
  gender?:"Male" | "Female" | "Others";
  mobileNumber:string;
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
