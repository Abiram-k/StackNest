import { IUser } from "../../types/IUser.js";

export interface IAdminService {
  fetchAllUsers(
    filter: string,
    sort: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; totalPages: number }>;
  getSalesDetails(
    type: string,
    month: string
  ): Promise<{
    data: any;
    totalSales: number;
    salesInfo: {
      userName: string;
      amount: number;
      planName: string;
      purchasedAt: string;
      endedAt: string;
    }[];
  }>;

  getUserEngagement(year: number): Promise<{
    userEngagement: { month: string; userCount: number }[];
    thisMonthPercentage: number | null;
    totalUsersCount: number;
    totalRoomsCount: number;
    totalPremiumUserCount: number;
  }>;
  blockUser(userName: string): Promise<boolean>;
}
