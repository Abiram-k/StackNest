import mongoose, { Types } from "mongoose";
import crypto from "crypto";
import { IUser } from "../types/IUser";
import { v4 as uuidv4 } from "uuid";

const PremiumHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "expired", "pending"],
      required: true,
    },
    startingDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    premiumPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Premium",
      required: true,
    },
  },
  { timestamps: true }
);
const userSchema = new mongoose.Schema<IUser>(
  {
    googleId: {
      type: String,
      unique: true,
      default: "",
    },
    githubId: {
      type: String,
      unique: true,
      default: "",
    },
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
      lowercase: true,
    },
    password: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    gender: {
      type: "String",
      enu: ["Male", "Female", "Others", ""],
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userName: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    pushSubscriptions: [
      {
        endpoint: { type: String, required: true },
        keys: {
          p256dh: { type: String, required: true },
          auth: { type: String, required: true },
        },
      },
    ],
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    challengePoints: {
      type: Number,
      default: 0,
    },
    streakClaimDate: {
      type: Date,
      defualt: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    friends: {
      type: [String],
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rewards: [
      {
        rewardId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reward",
          required: true,
        },
        benefitKey: {
          type: String,
          required: true,
        },
        redeemedAt: {
          type: Date,
          default: Date.now,
        },
        isExpired: {
          type: Boolean,
          default: false,
        },
      },
    ],
    premiumBenefits: [
      {
        planId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Premium",
          required: true,
        },
        benefitKeys: {
          type: [String],
          required: true,
        },
        redeemedAt: {
          type: Date,
          default: Date.now,
        },
        isExpired: {
          type: Boolean,
          default: false,
        },
      },
    ],
    premiumHistory: {
      type: [PremiumHistorySchema],
      default: [],
    },
    resetToken: { type: String, default: undefined },
    resetTokenExpiration: { type: Date, default: undefined },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    blockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ email: 1, isBlocked: 1 });
userSchema.index({ friends: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ "premiumHistory.status": 1 });
userSchema.index({ isBlocked: 1 });

userSchema.pre("save", function (next) {
  if (!this.avatar) {
    const hash = crypto
      .createHash("md5")
      .update(this.email.trim().toLowerCase())
      .digest("hex");
    this.avatar = `https://www.gravatar.com/avatar/${hash}?d=robohash`;
  }
  if (!this.userName) {
    const uniqueId = uuidv4().substring(0, 6);
    this.userName = this.firstName
      ? `${this.firstName?.toLowerCase()}_${uniqueId}`
      : "";
  }
  next();
});
export default mongoose.model("User", userSchema);
