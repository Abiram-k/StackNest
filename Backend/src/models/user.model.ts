import mongoose from "mongoose";
import crypto from "crypto";
import { IUser } from "../interfaces/IUser";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema<IUser>(
  {
    googleId: {
      type: String,
    },
    name: {
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
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    userName: {
      type: String,
      unique: true,
      default: function () {
        const uniqueId = uuidv4().substring(0, 6);
        return this.name ? `${this.name.toLowerCase()}_${uniqueId}` : "";
      },
    },
    avatar: {
      type: String,
      default: function () {
        const hash = crypto
          .createHash("md5")
          .update(this.email.trim().toLowerCase())
          .digest("hex");
        return `https://www.gravatar.com/avatar/${hash}?d=robohash`;
      },
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
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
    premiumHistory: {
      type: [
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
      ],
      default: [],
    },
    resetToken: { type: String, default: undefined },
    resetTokenExpiration: { type: Date, default: undefined },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
