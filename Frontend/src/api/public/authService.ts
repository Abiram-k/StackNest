import {
  axiosResponse,
  LoginResponse,
  LoginUser,
  typeRegisterUserWithOtp,
} from "@/types";
import { HttpService } from "../httpService";
import { AUTH_ROUTES } from "@/constants/apiRoutes";

export class UserAuthService {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async login(data: LoginUser, role: string): Promise<LoginResponse> {
    return this.httpService.post<LoginResponse>(AUTH_ROUTES.LOGIN, {
      role,
      ...data,
    });
  }
  async logout(role: string): Promise<axiosResponse> {
    return this.httpService.post(AUTH_ROUTES.LOGOUT, { role });
  }

  async initiateRegistration(data: { email: string }): Promise<void> {
    return this.httpService.post(AUTH_ROUTES.INITIATE_REGISTRATION, data);
  }

  async createUser(data: typeRegisterUserWithOtp): Promise<void> {
    return this.httpService.post(AUTH_ROUTES.REGISTER, data);
  }

  async forgotPassword(data: { email: string }): Promise<void> {
    return this.httpService.post(AUTH_ROUTES.FORGOT_PASSWORD, data);
  }

  async resetPassword(data: {
    token?: string;
    password: string;
  }): Promise<void> {
    return this.httpService.post(AUTH_ROUTES.RESET_PASSWORD, data);
  }
}
 