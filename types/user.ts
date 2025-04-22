// export type LoginUser = {
//   email: string;
//   password: string;
//   captchaToken?: string;
//   role?: string;
// };

// export type RegisterUser = {
//   name: string;
//   email: string;
//   password: string;
// };

// export type typeRegisterUserWithOtp = RegisterUser & { otp: string };

// export type typeUserResetToken = {
//   id: string;
//   resetToken: string;
// };

// export type verifyPasswordSchemaType = {
//   password: string;
//   confirmPassword: string;
// };

// export type verifyUserProfileSchemaType = {
//   email?: string;
//   avatar?: string;
//   firstName: string;
//   userName: string;
//   gender?: string;
//   country?: string;
//   description?: string;
//   mobileNumber?: string;
//   streak?:number;
//   streakClaimDate?:Date;
//   isVerified?:boolean;
//   isChatBotAuthorise?:boolean;
// };

// export type axiosResponse = {
//   success: boolean;
//   message: string;
// };

// export interface IUser extends Document {
//   _id: string;
//   googleId: string;
//   firstName: string;
//   email: string;
//   password: string;
//   country: string;
//   description: string;
//   gender?: "Male" | "Female" | "Others";
//   mobileNumber: string;
//   role: "user" | "admin";
//   userName: string;
//   avatar: string;
//   streak: number;
//   streakClaimDate: Date;
//   failedLoginAttempts: number;
//   lastLogin: Date;
//   friends: string[];
//   isBlocked: boolean;
//   blockedUntil: Date;
//   isVerified: boolean;
//   premiumHistory: {
//     status: "active" | "expired" | "pending";
//     startingDate: Date;
//     endingDate: Date;
//     premiumPlan: string;
//   }[];
//   resetToken: string;
//   resetTokenExpiration: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface RoomSchema {
//   title: string;
//   description: string;
//   limit: number;
//   isPremium: string;
//   isPrivate: string;
//   password?: string;
//   // scheduledAt?: Date;
// }

