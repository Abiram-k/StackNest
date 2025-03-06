import { NextFunction, Request, Response } from "express";
import { UserRoomService } from "../../services/user/user.room.service";
import { Types } from "mongoose";
import { DecodedToken } from "../../types/IAuth";

export class UserRoomController {
  private userRoomService: UserRoomService;

  constructor(userService: UserRoomService) {
    this.userRoomService = userService;
  }

  async createRoom(req: Request, res: Response, next: NextFunction) {
    const user = req.user as { userId: Types.ObjectId; role: string };
    const result = await this.userRoomService.createRoom(user.userId, req.body);
    res.status(200).json({ message: "Room created", success: result });
  }

  async updateRoom(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;
    await this.userRoomService.updateRoom(id as string, req.body);
    res
      .status(200)
      .json({ message: "Room updated successfuly", success: true });
  }

  async fetchMyRooms(req: Request, res: Response, next: NextFunction) {
    console.log("Request gotten MY");
    const user = req.user as { userId: Types.ObjectId; role: string };
    const myRooms = await this.userRoomService.fetchMyRooms(user.userId);
    res
      .status(200)
      .json({ message: "Fetch all my rooms", success: true, myRooms });
  }

  async fetchAllAvailableRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("Request gotten ALL");
  }
}
