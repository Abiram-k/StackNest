import { Types } from "mongoose";
import { RoomSchema } from "../../../../types/user";
import { IRoom } from "../../types/IRoom";

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
  joinRoom(userId: string, roomId: string): Promise<boolean | undefined>;
  verifyPassword(
    roomId: string,
    password: string
  ): Promise<boolean | undefined>;
}
