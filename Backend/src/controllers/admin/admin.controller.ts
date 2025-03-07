import { NextFunction, Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service";
import { RoomService } from "../../services/room.service";

export class AdminController {
  private adminService: AdminService;
  private roomService: RoomService;
  constructor(adminService: AdminService, roomService: RoomService) {
    this.adminService = adminService;
    this.roomService = roomService;
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

  async fetchAllAvailableRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user as { userId: string; role: string };
      const filter = String(req.query.filter || "");
      const sort = String(req.query.sort || "");
      const search = String(req.query.search || "");
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { rooms, totalPages } = await this.roomService.fetchAvailableRooms(
        user.role,
        page,
        limit,
        user.userId,
        filter,
        sort,
        search
      );

      res.status(200).json({
        message: "All Avalible Rooms fetched",
        success: true,
        rooms,
        totalPages: totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchSelectedRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user as { userId: string; role: string };
      const room = await this.roomService.fetchSelectedRoom(user.role, id);
      res.status(200).json({
        message: "Fetched successfully with roomId",
        success: true,
        room,
      });
    } catch (error) {
      next(error);
    }
  }
}
