import { IUser } from "../../types/IUser";

export interface IAdminService {
  fetchAllUsers(
    filter: string,
    sort: string,
    search: string,
    page: number,
    limit: number
  ): Promise<{ users: IUser[]; totalPages: number }>;

  blockUser(userName: string): Promise<boolean>;
}
