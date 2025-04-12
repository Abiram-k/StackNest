import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface";
import { IUser } from "../types/IUser";
import User from "../models/user.model";

enum FilterTags {
  "isBlocked" = "Blocked",
  "isPremium" = "Premium",
  "isGoogleUser" = "Google users",
  "isAscending" = "Ascending",
}

export class AdminRespository implements IAdminRepository<IUser> {
  async getUsers(
    filter?: string,
    sort?: string,
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; totalPages: number }> {
    try {
      const query: any = {};

      if (search) {
        query.$or = [
          { userName: { $regex: `^${search}`, $options: "i" } },
          { email: { $regex: `^${search}`, $options: "i" } },
          { _id: search },
        ];
      }
      if (filter == FilterTags.isBlocked) {
        query.isBlocked = true;
      } else if (filter == FilterTags.isPremium) {
        query.isVerified = true;
      } else if (filter == FilterTags.isGoogleUser) {
        query.googleId = { $ne: "" };
      }
      query.role = "user";

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);
      let sortOption = {};
      if (sort) {
        if (sort == FilterTags.isAscending) {
          sortOption = { createdAt: 1 };
        } else {
          sortOption = { createdAt: -1 };
        }
      }

      const users = await User.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return { users, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userName: string): Promise<boolean> {
    try {
      const user = await User.findOne({ userName });
      const currentStatus = user?.isBlocked;
      const updatedUser = await User.findOneAndUpdate(
        { userName },
        { $set: { isBlocked: !currentStatus } },
        { new: true }
      );
      if (updatedUser) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }
  async getUserBasedOnYear(year: number) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`);
    const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    return await User.find({
      createdAt: {
        $gte: start,
        $lt: end,
      },
    });
  }
}
