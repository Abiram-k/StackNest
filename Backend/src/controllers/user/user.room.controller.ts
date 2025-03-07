import { NextFunction, Request, Response } from "express";
import { RoomService } from "../../services/room.service";
import { Types } from "mongoose";

export class UserRoomController {
  private roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };
      const result = await this.roomService.createRoom(user.userId, req.body);
      res.status(200).json({ message: "Room created", success: result });
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("From room update service handler");

      const { id } = req.query;
      await this.roomService.updateRoom(id as string, req.body);
      res
        .status(200)
        .json({ message: "Room updated successfuly", success: true });
    } catch (error) {
      next(error);
    }
  }

  async fetchMyRooms(req: Request, res: Response, next: NextFunction) {
    const user = req.user as { userId: Types.ObjectId; role: string };
    const myRooms = await this.roomService.fetchMyRooms(user.userId);
    res
      .status(200)
      .json({ message: "Fetch all my rooms", success: true, rooms: myRooms });
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
        message: "Avalible Rooms fetched",
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

  async removeRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.roomService.removeRoom(id);
      res.status(200).json({ message: "Room removed", success: true });
    } catch (error) {
      next(error);
    }
  }
}
