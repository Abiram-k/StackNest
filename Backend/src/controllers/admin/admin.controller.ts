import { NextFunction, Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service";

export class AdminController {
  private adminService: AdminService;
  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async fetchAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
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

      res.status(200).json({
        message: "Users fetched",
        success: true,
        users: users,
        totalPages: totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userName } = req.params;
      await this.adminService.blockUser(userName);
      res.status(200).json({
        message: "User updated",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
