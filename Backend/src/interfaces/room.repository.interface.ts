import { Types } from "mongoose";

export interface IRoomRepository<T> {
  createRoom(data: Partial<T>): Promise<boolean>;
  updateRoom(id: string, data: Partial<T>): Promise<boolean>;
  findByHostId(id: Types.ObjectId): Promise<Partial<T>[] | null>;
  findAvailableRooms(
    role: string,
    page: number,
    limit: number,
    id?: string,
    filter?: string,
    sort?: string,
    search?: string
  ): Promise<{ rooms: T[]; totalPages: number }>;
  findSelectedRoom(populateHost: boolean, id: string): Promise<T | null>;
  removeById(id: string): Promise<boolean>;
  blockRoom(id: string): Promise<boolean>;
  findByRoomId(roomId: string): Promise<T | null>;
  addParticipant(userId:Types.ObjectId,roomId: string): Promise<boolean>;
}
