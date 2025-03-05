import { IAdminRepository } from "../../interfaces/admin.repository.interface";
import { IUser } from "../../types/IUser";

export class AdminService {
  constructor(private adminRepo: IAdminRepository<IUser>) {}

  async fetchAllUsers(
    filter: string,
    sort: string,
    search: string,
    page: number,
    limit: number
  ) {
    return this.adminRepo.getUsers(filter, sort, search, page, limit);
  }

  async blockUser(userName: string): Promise<boolean> {
    return this.adminRepo.blockUser(userName);
  }

  
}
