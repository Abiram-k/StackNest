import { Types } from "mongoose";
import { IRoomRepository } from "../interfaces/room.repository.interface";
import Room from "../models/room.model";
import { IRoom } from "../types/IRoom";

export class RoomRespository implements IRoomRepository<IRoom> {
  async createRoom(data: Partial<IRoom>): Promise<boolean> {
    try {
      const room = await Room.create(data);
      if (room) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(id: string, data: Partial<IRoom>): Promise<boolean> {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(id, data, {
        new: false,
      });
      return !!updatedRoom;
    } catch (error) {
      throw error;
    }
  }

  async findByHostId(id: Types.ObjectId): Promise<Partial<IRoom>[] | null> {
    try {
      return await Room.find({ host: id });
    } catch (error) {
      throw error;
    }
  }
}
