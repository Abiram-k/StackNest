import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { IUser } from "../types/IUser";
import User from "../models/user.model";

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
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
      if (filter == "Blocked") {
        query.isBlocked = true;
      } else if (filter == "Premium") {
        query.isVerified = true;
      } else if (filter == "Google users") {
        query.googleId = { $ne: "" };
      }
      query.role = "user";

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / 10);
      // let sortOption: {} = sort ? { [sort]: 1 } : { createdAt: -1 };
      let sortOption = {};
      if (sort) {
        if (sort == "Ascending") {
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
      console.log(currentStatus);
      const updatedUser = await User.findOneAndUpdate(
        { userName },
        { $set: { isBlocked: !currentStatus } },
        { new: true }
      );
      console.log(updatedUser);
      if (updatedUser) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }
}
