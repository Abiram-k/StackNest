export type LoginUser = {
  email: string;
  password: string;
  captchaToken?: string;
  role?:string;
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
  email?:string,
  avatar?:string;
  firstName: string;
  userName:string;
  gender?:string;
  country?:string;
  description?:string
  mobileNumber?:string
}

export type axiosResponse = {
  success:boolean;
  message:string
}