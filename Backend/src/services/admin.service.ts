import { IAdminService } from "../interfaces/services/admin.service.interface";
import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface";
import { IUser } from "./../types/IUser";
import createHttpError from "http-errors";
import { HttpStatus } from "../constants/enum.statusCode";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { IPremiumRepository } from "../interfaces/repositories/premium.repository.interface";
import { IPremium } from "../types/IPremium";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepo: IAdminRepository<IUser>,
    private _roomRepo: IRoomRepository<IRoom>,
    private _planRepo: IPremiumRepository<IPremium>,
    private _userBaseRepo: IUserBaseRepository<IUser>
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

  async getSalesDetails(
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
  }> {
    try {
      if (!type)
        throw createHttpError(HttpStatus.NOT_FOUND, "Type not founded");
      if (type.toLowerCase() === "monthly" && !month)
        throw createHttpError(HttpStatus.NOT_FOUND, "Month not founded");

      const users = await this._adminRepo.getAllUsers();
      const currentYear = new Date().getFullYear();

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
      let totalSales = 0;

      for (const user of users) {
        for (const history of user.premiumHistory) {
          const planData = await this._planRepo.getPremiumById(
            String(history.premiumPlan)
          );
          totalSales += planData?.discountAmount || 0;
        }
      }
      const formatDate = (date: Date) =>
        `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;

      let salesInfo: {
        userName: string;
        amount: number;
        planName: string;
        purchasedAt: string;
        endedAt: string;
      }[] = [];
      if (type.toLowerCase() === "monthly") {
        const targetMonthIndex = monthNames.indexOf(month);
        const weeklySales = [0, 0, 0, 0];
        for (const user of users) {
          for (const history of user.premiumHistory || []) {
            const createdAt = new Date(history.createdAt);

            if (
              createdAt.getFullYear() === currentYear &&
              createdAt.getMonth() === targetMonthIndex
            ) {
              const planData = await this._planRepo.getPremiumById(
                String(history.premiumPlan)
              );
              if (!planData)
                throw createHttpError(
                  HttpStatus.NOT_FOUND,
                  "Failed to find plan while on dashboard"
                );
              const amount = planData?.discountAmount || 0;

              const day = createdAt.getDate();
              let weekIndex = 0;
              if (day <= 7) weekIndex = 0;
              else if (day <= 14) weekIndex = 1;
              else if (day <= 21) weekIndex = 2;
              else weekIndex = 3;

              weeklySales[weekIndex] += amount;
              salesInfo.push({
                userName: user.userName,
                amount: planData.discountAmount,
                planName: planData.title,
                endedAt: formatDate(new Date(history.endingDate)),
                purchasedAt: formatDate(new Date(history.createdAt)),
              });
            }
          }
        }

        const data = weeklySales.map((total, index) => ({
          week: `Week ${index + 1}`,
          totalSales: total,
        }));
        return { data, totalSales, salesInfo };
      }

      if (type.toLowerCase() === "yearly") {
        const monthlySales = new Array(12).fill(0);

        for (const user of users) {
          for (const history of user.premiumHistory || []) {
            const createdAt = new Date(history.createdAt);

            if (createdAt.getFullYear() === currentYear) {
              const planData = await this._planRepo.getPremiumById(
                String(history.premiumPlan)
              );
              if (!planData)
                throw createHttpError(
                  HttpStatus.NOT_FOUND,
                  "Failed to find plan while on dashboard"
                );
              const amount = planData?.discountAmount || 0;

              const monthIndex = createdAt.getMonth();
              monthlySales[monthIndex] += amount;
              salesInfo.push({
                userName: user.userName,
                amount: planData.discountAmount,
                planName: planData.title,
                endedAt: formatDate(new Date(history.endingDate)),
                purchasedAt: formatDate(new Date(history.createdAt)),
              });
            }
          }
        }

        const data = monthlySales.map((total, index) => ({
          month: monthNames[index],
          totalSales: total,
        }));
        return { data, totalSales, salesInfo };
      }

      throw createHttpError(HttpStatus.BAD_REQUEST, "Invalid type provided.");
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
