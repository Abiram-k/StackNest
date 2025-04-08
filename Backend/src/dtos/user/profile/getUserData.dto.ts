export interface ResProfileData {
  email?: string;
  avatar?: string;
  firstName: string;
  userName: string;
  gender?: string;
  country?: string;
  description?: string;
  mobileNumber?: string;
  streak: number;
  streakClaimDate: Date;
  isVerified?: boolean;
  isChatBotAuthorise?: boolean;
}

export interface ResGetUserDataDTO {
  success: boolean;
  message: string;
  userDetails: ResProfileData;
}
