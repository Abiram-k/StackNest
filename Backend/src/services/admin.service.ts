import { IAdminService } from "../interfaces/services/admin.service.interface";
import { IAdminRepository } from "../interfaces/repositories/admin.repository.interface";
import { IUser } from "./../types/IUser";


export class AdminService implements IAdminService {
  constructor(private _adminRepo: IAdminRepository<IUser>) {}


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
