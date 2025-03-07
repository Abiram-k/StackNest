import { Types } from "mongoose";
import { IRoomRepository } from "../interfaces/room.repository.interface";
import Room from "../models/room.model";
import { IRoom } from "../types/IRoom";
import { title } from "process";

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
      const result = await Room.findOneAndUpdate(
        { roomId: id },
        { $set: data },
        { new: true }
      );

      return !!result;
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

  async findAvailableRooms(
    role: string,
    page: number,
    limit: number,
    id?: string,
    filter?: string,
    sort?: string,
    search?: string
  ): Promise<{ rooms: IRoom[]; totalPages: number }> {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { roomId: { $regex: search, $options: "i" } },
        ];
      }

      if (filter == "Private") {
        query.isPrivate = "Yes";
      } else if (filter == "Premium") {
        query.isPremium = "Yes";
      } else if (filter == "Live") {
        query.status = "online";
      }
      if (role == "user") query.host = { $ne: id };

      const totalRooms = await Room.countDocuments(query);
      const totalPages = Math.ceil(totalRooms / limit);

      const rooms = await Room.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

      return { rooms, totalPages };
    } catch (error) {
      throw error;
    }
  }

  async findSelectedRoom(
    populateHost: boolean,
    id: string
  ): Promise<IRoom | null> {
    try {
      let query = Room.findById(id);
      if (populateHost) {
        query.populate("host");
      }
      return query.exec();
    } catch (error) {
      throw error;
    }
  }

  async removeById(id: string): Promise<boolean> {
    try {
      const result = await Room.findOneAndDelete({ roomId: id });
      return !!result;
    } catch (error) {
      throw error;
    }
  }
}
