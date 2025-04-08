import { ResReport } from "@/types";
import { axiosResponse, IUser } from "../../../../types/user";
import { HttpService } from "../httpService";

interface UsersResponse {
  users: IUser[];
  totalPages: number;
}
interface ReportResponse {
  reports: ResReport[];
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
  async getAllReports(filter: string): Promise<ReportResponse> {
    const response = await this.httpService.get<ReportResponse>(
      `/admin/reports${filter}`
    );
    return response;
  }
  async resolveReport(reportId: string): Promise<axiosResponse> {
    const response = await this.httpService.post<axiosResponse>(
      `/admin/report/resolve`,
      { reportId }
    );
    return response;
  }
  async rejectReport(reportId: string): Promise<axiosResponse> {
    const response = await this.httpService.post<axiosResponse>(
      `/admin/report/reject`,
      { reportId }
    );
    return response;
  }

  async blockUser(userName: string): Promise<axiosResponse> {
    const response = await this.httpService.patch<axiosResponse>(
      `/admin/user/${userName}/block`
    );
    return response;
  }
}
