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
      if (filter) {
        
      }
      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers/10);
      const sortOption: {} = sort ? { [sort]: 1 } : { createdAt: -1 };
      const users = await User.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      return { users, totalPages };

    } catch (error) {
      throw error;
    }
  }
}
