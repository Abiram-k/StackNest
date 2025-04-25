import { Types } from "mongoose";
import { IRoom } from "../../types/IRoom.js";
import { IRoomSession } from "../../types/IRoomSession.js";
import { RoomSchema } from "../../dtos/user/room/createRoom.dto.js";

export interface IRoomService {
  createRoom(host: Types.ObjectId, data: RoomSchema): Promise<boolean>;
  updateRoom(roomId: string, data: RoomSchema): Promise<void>;
  fetchMyRooms(id: Types.ObjectId): Promise<IRoom[]>;
  fetchAvailableRooms(
    role: string,
    page: number,
    limit: number,
    id?: string,
    filter?: string,
    sort?: string,
    search?: string
  ): Promise<{ rooms: IRoom[]; totalPages: number }>;
  fetchSelectedRoom(role: string, id: string): Promise<IRoom>;
  removeRoom(id: string): Promise<boolean>;
  blockUser(id: string): Promise<boolean>;
  joinRoom(
    userId: string,
    roomId: string
  ): Promise<"host" | "common" | undefined>;

  fetchRoomSession(
    roomId: string,
    data: { sort: string; search: string; page: number; limit: number }
  ): Promise<{ totalPages: number; session: IRoomSession[] | null }>;

  verifyPassword(
    roomId: string,
    password: string
  ): Promise<boolean | undefined>;
  updateOnleaveRoom(roomId: string, userId: string): Promise<boolean>;
}
