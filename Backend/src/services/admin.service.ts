import { IAdminService } from "../interfaces/services/admin.service.interface";
import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface";
import { IUser } from "./../types/IUser";
import createHttpError from "http-errors";
import { HttpStatus } from "../constants/enum.statusCode";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IPremium } from "../types/IPremium";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepo: IAdminRepository<IUser>,
    private _roomRepo: IRoomRepository<IRoom>,
    private _planRepo: IPremiumRepository<IPremium>
  ) {}

  async getUserEngagement(year: number): Promise<{
    userEngagement: { month: string; userCount: number }[];
    thisMonthPercentage: number | null;
    totalUsersCount: number;
    totalRoomsCount: number;
    totalPremiumUserCount: number;
  }> {
    try {
      if (!year)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Year not founded (user-engagement)"
        );
      const users = await this._adminRepo.getUserBasedOnYear(year);
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthlyCounts: Record<string, number> = {};
      monthNames.forEach((month) => (monthlyCounts[month] = 0));
      users.forEach((user) => {
        const createdAt = new Date(user.createdAt);
        const month = monthNames[createdAt.getMonth()];
        monthlyCounts[month]++;
      });
      const currentDate = new Date();
      const currentMonthIndex = currentDate.getMonth();
      const currentMonth = monthNames[currentMonthIndex];
      const prevMonth =
        currentMonthIndex > 0 ? monthNames[currentMonthIndex - 1] : null;

      let growth: number | null = null;

      if (prevMonth) {
        const currentCount = monthlyCounts[currentMonth];
        const prevCount = monthlyCounts[prevMonth];

        if (prevCount > 0) {
          growth = ((prevCount - currentCount) / prevCount) * 100;
        } else if (prevCount === 0 && currentCount > 0) {
          growth = 100;
        } else {
          growth = 0;
        }
      }

      const userEngagement: { month: string; userCount: number }[] =
        monthNames.map((month) => ({
          month,
          userCount: monthlyCounts[month],
        }));
      const totalPremiumUserCount = users.reduce(
        (acc, user) => acc + (user.isVerified ? 1 : 0),
        0
      );
      const totalRoomsCount = await this._roomRepo.getTotalCount();
      const totalUsersCount = users.length;
      return {
        userEngagement,
        thisMonthPercentage: growth,
        totalPremiumUserCount,
        totalRoomsCount,
        totalUsersCount,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSalesDetails(type: string, month: string): Promise<any> {
    try {
      if (!type)
        throw createHttpError(HttpStatus.NOT_FOUND, "Type not founded");
      if (type == "Monthly" && !month)
        throw createHttpError(HttpStatus.NOT_FOUND, "Month not founded");
      const users = await this._adminRepo.getUserBasedOnYear(
        new Date().getFullYear()
      );
      
    } catch (error) {
      throw error;
    }
  }

  async fetchAllUsers(
    filter: string,
    sort: string,
    search: string,
    page: number,
    limit: number
  ) {
    return this._adminRepo.getUsers(filter, sort, search, page, limit);
  }

  async blockUser(userName: string): Promise<boolean> {
    return this._adminRepo.blockUser(userName);
  }
}
