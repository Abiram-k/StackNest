import { nanoid } from "nanoid";
import { RoomSchema } from "../../../../types/user";
import { IRoomRepository } from "../../interfaces/room.repository.interface";
import { IRoom } from "../../types/IRoom";
import { Types } from "mongoose";

export class UserRoomService {
  constructor(private roomRepo: IRoomRepository<IRoom>) {}

  async createRoom(host: Types.ObjectId, data: RoomSchema) {
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
  }

  async updateRoom(roomId: string, data: RoomSchema) {
    return await this.roomRepo.updateRoom(roomId, data);
  }

  async fetchMyRooms(id:Types.ObjectId) {
    return await this.roomRepo.findByHostId(id);
  }
  
}
