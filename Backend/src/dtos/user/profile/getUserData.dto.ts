export interface ResProfileData {
  email?: string;
  avatar?: string;
  firstName: string;
  userName: string;
  gender?: string;
  country?: string;
  description?: string;
  mobileNumber?: string;
}

export interface ResGetUserDataDTO {
  success: boolean;
  message: string;
  userDetails: ResProfileData;
}
