export type LoginUser = {
  email: string;
  password: string;
  captchaToken?: string;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
};

export type typeRegisterUserWithOtp = RegisterUser & { otp: string };

export type typeUserResetToken = {
  id: string;
  resetToken: string;
};

export type verifyPasswordSchemaType = {
  password: string;
  confirmPassword:string;
};


export type verifyUserProfileSchemaType = {
  firstName: string;
  userName:string;
  gender?:string;
  country:string;
  description?:string
  mobileNumber:string
}