import { axiosResponse, LoginResponse, LoginUser, typeRegisterUserWithOtp } from "@/types";
import { HttpService } from "../httpService";

export class UserAuthService {
  private httpService: HttpService;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async login(data: LoginUser, role: string): Promise<LoginResponse> {
    return this.httpService.post<LoginResponse>(`/auth/login`, {
      role,
      ...data,
    });
  }
  async logout(role:string): Promise<axiosResponse> {
    return this.httpService.post("/auth/logout", {role});
  }

  async initiateRegistration(data: { email: string }): Promise<void> {
    return this.httpService.post("/auth/initiate-registration", data);
  }

  async createUser(data: typeRegisterUserWithOtp): Promise<void> {
    return this.httpService.post("/auth/register", data);
  }

  async forgotPassword(data: { email: string }): Promise<void> {
    return this.httpService.post("/auth/forgot-password", data);
  }

  async resetPassword(data: {
    token?: string;
    password: string;
  }): Promise<void> {
    return this.httpService.post("/auth/reset-password", data);
  }
}
