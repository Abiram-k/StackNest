import { NextFunction, Request, Response } from "express";
// import { RoomService } from "../../services/room.service";
import { Types } from "mongoose";
import { HttpStatus } from "../../constants/enum.statusCode";
import { IUserRoomController } from "../../interfaces/controllers/user.room.controller.interface";
import { IRoomService } from "../../interfaces/services/room.service.interface";
import {
  CreateRoomDTO,
  ResCreateRoomDTO,
} from "../../dtos/user/room/createRoom.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { validateDtoError } from "../../utils/ValidateDtoError";
import {
  ResUpdateRoomDTO,
  UpdateRoomDTO,
} from "../../dtos/user/room/updateRoom.dto";
import { ResFetchMyRoomsDTO } from "../../dtos/user/room/fetchMyRoom.dto";
import { RoomResTypeDTO } from "../../dtos/public/roomData.dto";
import {
  FetchAvailableRoomDTO,
  ResFetchAvailableRoomDTO,
} from "../../dtos/user/room/fetchAvailableRooms.dto";
import { FetchSelectedRoomDTO } from "../../dtos/admin/roomManagement/fetchSelectedRoom.dto";
import { ResFetchSelectedRoomDTO } from "../../dtos/user/room/fetchSelectedRoom";
import {
  RemoveRoomDTO,
  ResRemoveRoomDTO,
} from "../../dtos/user/room/removeRoom.dto";
import { JoinRoomDTO, ResJoinRoomDTO } from "../../dtos/user/room/joinRoom.dto";
import {
  ResVerifyPasswordDTO,
  VerifyPasswordDTO,
} from "../../dtos/user/room/verifyPassword";

export class UserRoomController implements IUserRoomController {
  private _roomService: IRoomService;

  constructor(roomService: IRoomService) {
    this._roomService = roomService;
  }

  async createRoom(
    req: Request,
    res: Response<ResCreateRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: Types.ObjectId; role: string };

      const dto = plainToInstance(CreateRoomDTO, req.body);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      const result = await this._roomService.createRoom(user.userId, dto);

      // const result = await this._roomService.createRoom(user.userId, req.body);
      res
        .status(HttpStatus.OK)
        .json({ message: "Room created", success: result });
    } catch (error) {
      next(error);
    }
  }

  async updateRoom(
    req: Request,
    res: Response<ResUpdateRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { id } = req.query;

      const dto = plainToInstance(UpdateRoomDTO, req.query);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { id } = dto;

      await this._roomService.updateRoom(id as string, req.body);
      res
        .status(HttpStatus.OK)
        .json({ message: "Room updated successfuly", success: true });
    } catch (error) {
      next(error);
    }
  }

  async fetchMyRooms(
    req: Request,
    res: Response<ResFetchMyRoomsDTO>,
    next: NextFunction
  ): Promise<void> {
    const user = req.user as { userId: Types.ObjectId; role: string };

    const myRooms = await this._roomService.fetchMyRooms(user.userId);

    const formattedRooms: RoomResTypeDTO[] = myRooms.map((room) => ({
      _id: room._id,
      roomId: room.roomId,
      title: room.title,
      description: room.description,
      host: room.host,
      isBlocked: room.isBlocked,
      startedAt: room.startedAt,
      participants: room.participants,
      isPrivate: room.isPrivate,
      isPremium: room.isPremium,
      status: room.status,
      scheduledAt: room.scheduledAt,
      endedAt: room.endedAt,
      limit: room.limit,
      createdAt: room.createdAt,
      password: room.password,
    }));

    res.status(HttpStatus.OK).json({
      message: "Fetch all my rooms",
      success: true,
      rooms: formattedRooms,
    });
  }

  async fetchAllAvailableRooms(
    req: Request,
    res: Response<ResFetchAvailableRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user as { userId: string; role: string };

      const dto = plainToInstance(FetchAvailableRoomDTO, req.query);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;

      const { filter = "", sort = "", search = "", page = 1, limit = 10 } = dto;

      // Sanitize page and limit values
      const sanitizedPage = Math.max(1, Number(page) || 1);
      const sanitizedLimit = Math.max(1, Number(limit) || 10);

      // const filter = String(req.query.filter || "");
      // const sort = String(req.query.sort || "");
      // const search = String(req.query.search || "");
      // const page = Number(req.query.page) || 1;
      // const limit = Number(req.query.limit) || 10;

      const { rooms, totalPages } = await this._roomService.fetchAvailableRooms(
        user.role,
        sanitizedPage,
        sanitizedLimit,
        user.userId,
        filter,
        sort,
        search
      );

      res.status(HttpStatus.OK).json({
        message: "Avalible Rooms fetched",
        success: true,
        rooms,
        totalPages: totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchSelectedRoom(
    req: Request,
    res: Response<ResFetchSelectedRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { id } = req.params;
      const dto = plainToInstance(FetchSelectedRoomDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { id } = dto;
      const user = req.user as { userId: string; role: string };

      const room = await this._roomService.fetchSelectedRoom(user.role, id);

      const formattedRooms: RoomResTypeDTO = {
        _id: room._id,
        roomId: room.roomId,
        title: room.title,
        description: room.description,
        password: room.password,
        host: room.host,
        isBlocked: room.isBlocked,
        startedAt: room.startedAt,
        participants: room.participants,
        isPrivate: room.isPrivate,
        isPremium: room.isPremium,
        status: room.status,
        scheduledAt: room.scheduledAt,
        endedAt: room.endedAt,
        limit: room.limit,
        createdAt: room.createdAt,
      };

      res.status(HttpStatus.OK).json({
        message: "Fetched successfully with roomId",
        success: true,
        room: formattedRooms,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeRoom(
    req: Request,
    res: Response<ResRemoveRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { id } = req.params;
      const dto = plainToInstance(RemoveRoomDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { id } = dto;

      await this._roomService.removeRoom(id);
      res
        .status(HttpStatus.OK)
        .json({ message: "Room removed", success: true });
    } catch (error) {
      next(error);
    }
  }

  async joinRoom(
    req: Request,
    res: Response<ResJoinRoomDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      // const { roomId } = req.body;

      const dto = plainToInstance(JoinRoomDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { roomId } = dto;

      const user = req.user as { userId: string; role: string };
      await this._roomService.joinRoom(user.userId, roomId);
      res
        .status(HttpStatus.OK)
        .json({ message: "Successfully joined in room", success: true });
    } catch (error) {
      next(error);
    }
  }

  async verifyPassword(
    req: Request,
    res: Response<ResVerifyPasswordDTO>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roomId } = req.params;

      // const { password } = req.body;

      const dto = plainToInstance(VerifyPasswordDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { password } = dto;

      const isVerified = await this._roomService.verifyPassword(
        roomId,
        password
      );
      if (!isVerified) throw new Error("Password verification failed");
      res
        .status(HttpStatus.OK)
        .json({ message: "Password verified", success: true });
    } catch (error) {
      next(error);
    }
  }
}
