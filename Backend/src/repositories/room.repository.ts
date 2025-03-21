import { Types } from "mongoose";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import Room from "../models/room.model";
import { IRoom } from "../types/IRoom";

enum FilterTags {
  "Private" = "Private",
  "Premium" = "Premium",
  "Live" = "Live",
}

export class RoomRespository implements IRoomRepository<IRoom> {
  async createRoom(roomData: Partial<IRoom>): Promise<boolean> {
    try {
      const room = await Room.create(roomData);
      if (room) return true; 
      else return false;
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(id: string, data: Partial<IRoom>): Promise<boolean> {
    try {
      const result = await Room.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async findByHostId(hostId: Types.ObjectId): Promise<IRoom[] | null> {
    try {
      return await Room.find({ host: hostId }).populate("participants.user");
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

      if (filter == FilterTags.Private) {
        query.isPrivate = "Yes";
      } else if (filter == FilterTags.Premium) {
        query.isPremium = "Yes";
      } else if (filter == FilterTags.Live) {
        query.status = "online";
      }
      if (role == "user") query.host = { $ne: id };

      const totalRooms = await Room.countDocuments(query);
      const totalPages = Math.ceil(totalRooms / limit);

      const rooms = await Room.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("participants.user");

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
        query.populate("host").populate("participants.user");
      }
      return query.exec();
    } catch (error) {
      throw error;
    }
  }

  async removeById(id: string): Promise<boolean> {
    try {
      const result = await Room.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async blockRoom(id: string): Promise<boolean> {
    try {
      const room = await Room.findById(id);
      const currentStatus = room?.isBlocked;
      const updatedRoom = await Room.findByIdAndUpdate(
        id,
        { $set: { isBlocked: !currentStatus } },
        { new: true }
      );
      return !!updatedRoom;
    } catch (error) {
      throw error;
    }
  }

  async findByRoomId(roomId: string): Promise<IRoom | null> {
    try {
      return await Room.findOne({ roomId });
    } catch (error) {
      throw error;
    }
  }

  async addParticipant(userId: string, roomId: string): Promise<boolean> {
    try {
      const isparticipantAdded = await Room.findOneAndUpdate(
        { roomId },
        { $addToSet: { participants: { user: userId, joinedAt: new Date() } } },
        { new: true }
      );
      return !!isparticipantAdded;
    } catch (error) {
      throw error;
    }
  }
}
