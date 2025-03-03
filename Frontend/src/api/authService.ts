import { LoginResponse } from "../../../types/index";
import { LoginUser, typeRegisterUserWithOtp } from "../../../types/user";
import { HttpService } from "./httpService";

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
