import { nanoid } from "nanoid";
import { RoomSchema } from "../../../types/user";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import { IRoomService } from "../interfaces/services/room.service.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { HttpStatus } from "../constants/enum.statusCode";

export class RoomService implements IRoomService {
  constructor(
    private _roomRepo: IRoomRepository<IRoom>,
    private _userBaseRepo: IUserBaseRepository<IUser>
  ) {}

  async createRoom(host: Types.ObjectId, data: RoomSchema) {
    try {
      const roomData: any = {};
      const hostId = String(host);
      const hostData = await this._userBaseRepo.findById(hostId);

      if (!hostData?.isVerified && data.isPremium == "Yes") {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Can't create premium rooms"
        );
      }

      if (data.scheduledAt) {
        const scheduledDate = new Date(data.scheduledAt);
        const currentDate = new Date();
        if (scheduledDate < currentDate) {
          roomData.startedAt = new Date();
          roomData.status = "online";
        } else {
          const localDate = new Date(data.scheduledAt);
          const utcDate = new Date(
            localDate.getTime() - localDate.getTimezoneOffset() * 60000
          );
          data.scheduledAt = utcDate;
          roomData.status = "scheduled";
          roomData.startedAt = null;
        }
      }
      roomData.roomId = nanoid(8);
      roomData.host = host;
      return this._roomRepo.createRoom({ ...roomData, ...data });
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(roomId: string, data: RoomSchema) {
    try {
      const updatedData: Partial<IRoom> = {
        title: data.title,
        limit: data.limit,
        isPrivate: data.isPrivate,
        password: data.password,
        isPremium: data.isPremium,
        description: data.description,
      };

      await this._roomRepo.updateRoom(roomId, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async fetchMyRooms(id: Types.ObjectId) {
    try {
      const myRooms = await this._roomRepo.findByHostId(id);
      if (myRooms) return myRooms;
      else throw createHttpError(HttpStatus.NOT_FOUND, "My Rooms not founded");
    } catch (error) {
      throw error;
    }
  }

  async fetchAvailableRooms(
    role: string,
    page: number,
    limit: number,
    id?: string,
    filter?: string,
    sort?: string,
    search?: string
  ) {
    try {
      const availableRoom = await this._roomRepo.findAvailableRooms(
        role,
        page,
        limit,
        id,
        filter,
        sort,
        search
      );
      if (availableRoom) return availableRoom;
      else throw createHttpError(HttpStatus.NOT_FOUND, "Rooms not founded");
    } catch (error) {
      throw error;
    }
  }

  async fetchSelectedRoom(role: string, id: string) {
    try {
      const room = await this._roomRepo.findSelectedRoom(role == "admin", id);
      if (!room)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "RoomId is incorrect, not found"
        );

      return room;
    } catch (error) {
      throw error;
    }
  }

  async removeRoom(id: string) {
    try {
      const isDeleted = await this._roomRepo.removeById(id);
      if (!isDeleted) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "RoomId not founded,while removing "
        );
      } else {
        return isDeleted;
      }
    } catch (error) {
      throw error;
    }
  }

  async blockUser(id: string) {
    try {
      const isBlockedRoom = await this._roomRepo.blockRoom(id);
      if (!isBlockedRoom)
        throw createHttpError(HttpStatus.NOT_FOUND, "Failed to block room");
      return isBlockedRoom;
    } catch (error) {
      throw error;
    }
  }

  async joinRoom(userId: string, roomId: string) {
    try {
      if (!userId)
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "Not Authenticated to join"
        );
      const room = await this._roomRepo.findByRoomId(roomId);
      const user = await this._userBaseRepo.findById(userId);
      if (!room) throw createHttpError(HttpStatus.NOT_FOUND, "Room not found");

      if (room.host.toString() == userId) {
        console.log("Host joined the room");
        return true;
      }

      if (room.isBlocked) {
        throw createHttpError(HttpStatus.FORBIDDEN, "Room is unavailable");
      }
      if (!user?.isVerified && room.isPremium == "Yes") {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          "Only premium members can join"
        );
      }

      if (room.participants.some((p) => p?.user?.toString() === userId)) {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          "Already joined in the room"
        );
      }

      if (room.participants.length >= room.limit) {
        throw createHttpError(HttpStatus.FORBIDDEN, "Room is full");
      }
      const isAdded = await this._roomRepo.addParticipant(userId, roomId);

      if (!isAdded)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Failed to add Participant"
        );
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(roomId: string, password: string) {
    try {
      if (!roomId || !password) {
        console.log("Room id or password is missing!");
        return;
      }
      const room = await this._roomRepo.findByRoomId(roomId);
      if (!room) throw createHttpError(HttpStatus.NOT_FOUND, "Room not found");

      if (room.password != password) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, "Invalid Password ");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
