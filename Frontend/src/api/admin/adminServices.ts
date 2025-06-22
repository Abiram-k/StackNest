import { axiosResponse, IUser, ResReport } from "@/types";
import { HttpService } from "../httpService";
import { ADMIN_ROUTES } from "@/constants/apiRoutes";

interface UsersResponse {
  users: IUser[];
  totalPages: number;
}
interface ReportResponse {
  reports: ResReport[];
  totalPages: number;
}
type getUserEngagementRes = axiosResponse & {
  userEngagement: { month: string; userCount: number }[];
  thisMonthPercentage: number | null;
  totalUsersCount: number;
  totalRoomsCount: number;
  totalPremiumUserCount: number;
};

type getSalesDetailsRes = axiosResponse & {
  data: any;
  salesInfo: {
    userName: string;
    amount: number;
    planName: string;
    purchasedAt: string;
    endedAt: string;
  }[];
  totalSales: number;
};

export class AdminService {
  private readonly httpService: HttpService;
  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  async fetchAllUsers(filter: string): Promise<UsersResponse> {
    const response = await this.httpService.get<UsersResponse>(
      ADMIN_ROUTES.USERS(filter)
    );
    return response;
  }
  async getAllReports(filter: string): Promise<ReportResponse> {
    const response = await this.httpService.get<ReportResponse>(
      ADMIN_ROUTES.REPORTS(filter)
    );
    return response;
  }
  async getSalesDetails(
    type: "monthly" | "yearly",
    month?: string
  ): Promise<getSalesDetailsRes> {
    return await this.httpService.get(ADMIN_ROUTES.SALES_DETAILS(type, month));
  }
  async resolveReport(reportId: string): Promise<axiosResponse> {
    const response = await this.httpService.post<axiosResponse>(
      ADMIN_ROUTES.REPORT_RESOLVE,
      { reportId }
    );
    return response;
  }
  async rejectReport(reportId: string): Promise<axiosResponse> {
    const response = await this.httpService.post<axiosResponse>(
      ADMIN_ROUTES.REPORT_REJECT,
      { reportId }
    );
    return response;
  }

  async blockUser(userName: string): Promise<axiosResponse> {
    const response = await this.httpService.patch<axiosResponse>(
      ADMIN_ROUTES.BLOCK_USER(userName)
    );
    return response;
  }

  async getUserEngagement(year: number): Promise<getUserEngagementRes> {
    return await this.httpService.get(ADMIN_ROUTES.USER_ENGAGEMENT(year));
  }
}
