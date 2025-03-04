import { NextFunction, Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service";

export class AdminController {
  private adminService: AdminService;
  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async fetchAllUsers(req: Request, res: Response, next: NextFunction) {

    const filter = req.query.filter ? String(req.query.filter) : "";
    const sort = req.query.sort ? String(req.query.sort) : "";
    const search = req.query.search ? String(req.query.search) : "";
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const { users, totalPages } = await this.adminService.fetchAllUsers(
      filter,
      sort,
      search,
      page,
      limit
    );

    res
      .status(200)
      .json({
        message: "Users fetched",
        success: true,
        users:users,
        totalPages:totalPages
      });
  }
}
