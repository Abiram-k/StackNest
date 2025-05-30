import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../constants/enum.statusCode.js";
import { IAdminController } from "../../interfaces/controllers/admin.controller.interface.js";
import { IAdminService } from "../../interfaces/services/admin.service.interface.js";
import { IRoomService } from "../../interfaces/services/room.service.interface.js";
import { plainToInstance } from "class-transformer";
import {
  FetchAllUsersDTO,
  ResFetchAllUsersDTO,
} from "../../dtos/admin/userManagement/fetchAllUsers.dto.js";
import { validate } from "class-validator";
import { UserResTypeDTO } from "../../dtos/public/userData.dto.js";
import {
  BlockUserDTO,
  ResBlockUserDTO,
} from "../../dtos/admin/userManagement/blockUser.dto.js";
import { validateDtoError } from "../../utils/ValidateDtoError.js";
import { ResFetchAllRoomDTO } from "../../dtos/admin/roomManagement/fetchAllRooms.dto.js";
import { RoomResTypeDTO } from "../../dtos/public/roomData.dto.js";
import {
  FetchSelectedRoomDTO,
  ResFetchSelectedRoomDTO,
} from "../../dtos/admin/roomManagement/fetchSelectedRoom.dto.js";
import { BlockRoomDTO } from "../../dtos/admin/roomManagement/blockRoom.dto.js";

export class AdminController implements IAdminController {
  private _adminService: IAdminService;
  private _roomService: IRoomService;

  constructor(adminService: IAdminService, roomService: IRoomService) {
    this._adminService = adminService;
    this._roomService = roomService;
  }

  async getUserEngagement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const year: number = Number(req.query.year) || 0;
      const {
        userEngagement,
        thisMonthPercentage,
        totalPremiumUserCount,
        totalRoomsCount,
        totalUsersCount,
      } = await this._adminService.getUserEngagement(year);

      res.status(HttpStatus.OK).json({
        message: "successfully fetched engagement",
        success: true,
        userEngagement,
        thisMonthPercentage,
        totalPremiumUserCount,
        totalRoomsCount,
        totalUsersCount,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchAllUsers(
    req: Request,
    res: Response<ResFetchAllUsersDTO>,
    next: NextFunction
  ) {
    try {
      const dto = plainToInstance(FetchAllUsersDTO, req.query);
      const errors = await validate(dto);

      if (errors.length) {
        console.log({
          message: "Validation failed",
          errors: errors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        });
        return;
      }
      const { filter = "", sort = "", search = "", page = 1, limit = 10 } = dto;

      const { users, totalPages } = await this._adminService.fetchAllUsers(
        filter,
        sort,
        search,
        page,
        limit
      );

      const formattedUsers: UserResTypeDTO[] = users.map((user) => ({
        googleId: user.googleId,
        firstName: user.firstName,
        userName: user.userName,
        email: user.email,
        country: user.country,
        description: user.description,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        role: user.role,
        isBlocked: user.isBlocked,
        isVerified: user.isVerified,
        avatar: user.avatar,
        streak: user.streak,
        resetToken: user.resetToken,
      }));

      res.status(HttpStatus.OK).json({
        message: "Users fetched",
        success: true,
        users: formattedUsers,
        totalPages: totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSalesDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const type = String(req.query.type) || "";
      const month = String(req.query.month) || "";
      const { data, totalSales,salesInfo } = await this._adminService.getSalesDetails(type, month);
      res.status(HttpStatus.OK).json({
        message: "Sales details fetched",
        success: true,
        data,
        totalSales,
        salesInfo
      });
    } catch (error) {
      next(error);
    }
  }

  async blockUser(
    req: Request,
    res: Response<ResBlockUserDTO>,
    next: NextFunction
  ) {
    try {
      const dto = plainToInstance(BlockUserDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { userName } = dto;
      await this._adminService.blockUser(userName);
      res.status(HttpStatus.OK).json({
        message: "User updated",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchAllAvailableRooms(
    req: Request,
    res: Response<ResFetchAllRoomDTO>,
    next: NextFunction
  ) {
    try {
      const user = req.user as { userId: string; role: string };
      const filter = String(req.query.filter || "");
      const sort = String(req.query.sort || "");
      const search = String(req.query.search || "");
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { rooms, totalPages } = await this._roomService.fetchAvailableRooms(
        user.role,
        page,
        limit,
        user.userId,
        filter,
        sort,
        search
      );

      const formattedRooms: RoomResTypeDTO[] = rooms
        .map((room) => ({
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
          roomType: room.roomType,
        }))
        .sort((a, b) =>
          a.roomType === "general" ? -1 : b.roomType === "general" ? 1 : 0
        );

      res.status(HttpStatus.OK).json({
        message: "All Avalible Rooms fetched",
        success: true,
        rooms: formattedRooms,
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
  ) {
    try {
      // const { id } = req.params;

      const dto = plainToInstance(FetchSelectedRoomDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { id } = dto;

      const user = req.user as { userId: string; role: string };
      const room = await this._roomService.fetchSelectedRoom(user.role, id);
      res.status(HttpStatus.OK).json({
        message: "Fetched successfully with roomId",
        success: true,
        room,
      });
    } catch (error) {
      next(error);
    }
  }

  async blockRoom(
    req: Request,
    res: Response<ResBlockUserDTO>,
    next: NextFunction
  ) {
    try {
      // const { id } = req.params;

      const dto = plainToInstance(BlockRoomDTO, req.params);
      const errors = await validate(dto);
      if (!validateDtoError(errors, res)) return;
      const { id } = dto;

      await this._roomService.blockUser(id);
      res.status(HttpStatus.OK).json({
        message: "Action success (block/unblock)",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomSessionHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const sort = String(req.query.sort || "");
      const search = String(req.query.search || "");
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const data: {
        sort: string;
        search: string;
        page: number;
        limit: number;
      } = { sort, search, page, limit };
      const { session, totalPages } = await this._roomService.fetchRoomSession(
        roomId,
        data
      );
      res.status(HttpStatus.OK).json({
        message: "Room session fetched",
        success: true,
        session,
        totalPages: totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
}
