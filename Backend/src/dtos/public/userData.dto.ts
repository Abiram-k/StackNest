export type UserResTypeDTO = {
    googleId: string;
    firstName: string;
    email: string;
    country: string;
    description: string;
    gender?: "Male" | "Female" | "Others";
    mobileNumber: string;
    role: "user" | "admin";
    userName: string;
    avatar: string;
    streak: number;
    // streakClaimDate: Date;
    isBlocked: boolean;
    isVerified: boolean;
    resetToken: string;
  };