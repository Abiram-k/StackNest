import { axiosResponse, IUser } from "../../../../types/user";
import { HttpService } from "../httpService";

interface UsersResponse {
  users: IUser[];
  totalPages: number;
}

export class AdminService {
  private readonly httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async fetchAllUsers(filter: string): Promise<UsersResponse> {
    const response = await this.httpService.get<UsersResponse>(
      `/admin/users${filter}`
    );
    return response;
  }

  async blockUser(userName: string): Promise<axiosResponse> {
    const response = await this.httpService.patch<axiosResponse>(`/admin/user/${userName}/block`);
    return response;
  }
}
