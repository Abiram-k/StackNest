export interface IAdminRepository<T> {
  getUsers(
    filter?: string,
    sort?: string,
    search?: string,
    page?: number,
    limit?: number
  ): Promise<{ users: T[]; totalPages: number }>;

  blockUser(userName: string): Promise<boolean>;
}
