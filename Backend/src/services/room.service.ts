import { nanoid } from "nanoid";
import { RoomSchema } from "../../../types/user";
import { IRoomRepository } from "../interfaces/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { Types } from "mongoose";
import createHttpError from "http-errors";

export class RoomService {
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

  async fetchMyRooms(id: Types.ObjectId) {
    const myRooms = await this.roomRepo.findByHostId(id);
    if (myRooms) return myRooms;
    else throw createHttpError(404, "My Rooms not founded");
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
    console.log(role, "Role from RoomService fetchAvailableRooms");

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
  }

  async fetchSelectedRoom(role: string, id: string) {
    const room = await this.roomRepo.findSelectedRoom(role == "admin", id);
    if (!room) throw createHttpError(404, "RoomId is incorrect, not found");

    return room;
  }

  async removeRoom(id: string) {
    const isDeleted = await this.roomRepo.removeById(id);
    if (!isDeleted) {
      throw createHttpError(404, "RoomId not founded,while removing ");
    } else {
      return isDeleted;
    }
  }
}
