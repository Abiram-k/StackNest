import { LoginUser, typeRegisterUserWithOtp } from "../../dtos/auth/login.dto";
import { BaseResponseType } from "../../types/general";
import { IUser } from "../../types/IUser";

export interface IAuthService {
  authenticateGoogleUser(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  login({ email, password, captchaToken, role }: LoginUser): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  handleGithubLogin(profile:Partial<IUser>):Promise<IUser>

  findUserById(userId:string):Promise<any>

  generateAccessToken(refreshToken: string): Promise<string | undefined>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  initiateRegistration(email: string): Promise<void>;

  register({
    email,
    password,
    name,
    otp,
  }: typeRegisterUserWithOtp): Promise<BaseResponseType>;
}
