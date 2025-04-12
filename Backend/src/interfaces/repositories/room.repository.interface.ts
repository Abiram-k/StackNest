import { Types } from "mongoose";

export interface IRoomRepository<T> {
  createRoom(data: Partial<T>): Promise<boolean>;
  updateRoom(id: string, data: Partial<T>): Promise<boolean>;
  findByHostId(id: Types.ObjectId): Promise<T[]>;
  findAvailableRooms(
    role: string,
    page: number,
    limit: number,
    id?: string,
    filter?: string,
    sort?: string,
    search?: string
  ): Promise<{ rooms: T[]; totalPages: number }>;
  getTotalCount(): Promise<number>;
  findSelectedRoom(populateHost: boolean, id: string): Promise<T | null>;
  removeById(id: string): Promise<string>;
  blockRoom(id: string): Promise<{ currentStatus: boolean; roomId: string }>;
  findByRoomId(roomId: string): Promise<T | null>;
  addOrUpdateParticipant(
    userId: string,
    roomId: string,
    joinedAt: Date
  ): Promise<boolean>;
  getLastJoinedTime(roomId: string, userId: string): Promise<Date | null>;
  updateParticipantDuration(
    roomId: string,
    userId: string,
    duration: number
  ): Promise<boolean>;
}
