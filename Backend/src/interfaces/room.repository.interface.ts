import { Types } from "mongoose";

export interface IRoomRepository<T> {
  createRoom(data: Partial<T>): Promise<boolean>;
  updateRoom(id: string, data: Partial<T>): Promise<boolean>;
  findByHostId(id: Types.ObjectId): Promise<Partial<T>[] | null>;
}
