import { nanoid } from "nanoid";
import { RoomSchema } from "../../../types/user";
import { IRoomRepository } from "../interfaces/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { Types } from "mongoose";
import createHttpError from "http-errors";

export class RoomService {
  constructor(private roomRepo: IRoomRepository<IRoom>) {}

  async createRoom(host: Types.ObjectId, data: RoomSchema) {
    try {
      const roomData: any = {};
      if (data.scheduledAt) {
        const localDate = new Date(data.scheduledAt);
        const utcDate = new Date(
          localDate.getTime() - localDate.getTimezoneOffset() * 60000
        );
        data.scheduledAt = utcDate;
        roomData.status = "scheduled";
        roomData.startedAt = null;
      } else {
        roomData.startedAt = new Date();
        roomData.status = "online";
      }
      roomData.roomId = nanoid(8);
      roomData.host = host;
      return this.roomRepo.createRoom({ ...roomData, ...data });
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

      await this.roomRepo.updateRoom(roomId, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async fetchMyRooms(id: Types.ObjectId) {
    try {
      const myRooms = await this.roomRepo.findByHostId(id);
      if (myRooms) return myRooms;
      else throw createHttpError(404, "My Rooms not founded");
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
      const availableRoom = await this.roomRepo.findAvailableRooms(
        role,
        page,
        limit,
        id,
        filter,
        sort,
        search
      );
      if (availableRoom) return availableRoom;
      else throw createHttpError(404, "Rooms not founded");
    } catch (error) {
      throw error;
    }
  }

  async fetchSelectedRoom(role: string, id: string) {
    try {
      const room = await this.roomRepo.findSelectedRoom(role == "admin", id);
      if (!room) throw createHttpError(404, "RoomId is incorrect, not found");

      return room;
    } catch (error) {
      throw error;
    }
  }

  async removeRoom(id: string) {
    try {
      const isDeleted = await this.roomRepo.removeById(id);
      if (!isDeleted) {
        throw createHttpError(404, "RoomId not founded,while removing ");
      } else {
        return isDeleted;
      }
    } catch (error) {
      throw error;
    }
  }

  async blockUser(id: string) {
    try {
      const isBlockedRoom = await this.roomRepo.blockRoom(id);
      if (!isBlockedRoom) throw createHttpError(404, "Failed to block room");
      return isBlockedRoom;
    } catch (error) {
      throw error;
    }
  }

  async joinRoom(userId: string, roomId: string) {
    try {
      if (!userId) throw createHttpError(401, "Not Authenticated to join");
      const room = await this.roomRepo.findByRoomId(roomId);
      if (!room) throw createHttpError(404, "Room not found");

      if (room.host.toString() == userId) {
        console.log("Host joined the room");
        return true;
      }

      if (room.isBlocked) {
        throw createHttpError(400, "Room is unavailable");
      }
      
      console.log("UserId: ", userId, "p.user_id: ");
      if (room.participants.some((p) => p?.user?.toString() === userId)) {
        throw createHttpError(400, "Already joined in the room");
      }

      if (room.participants.length >= room.limit) {
        throw createHttpError(400, "Room is full");
      }
      const isAdded = await this.roomRepo.addParticipant(userId, roomId);

      if (!isAdded) throw createHttpError(402, "Failed to add Participant");
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
      const room = await this.roomRepo.findByRoomId(roomId);
      if (!room) throw createHttpError(404, "Room not found");

      if (room.password != password) {
        throw createHttpError(402, "Invalid Password ");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
