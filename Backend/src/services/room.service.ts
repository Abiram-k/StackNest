import { nanoid } from "nanoid";
import { IRoomRepository } from "../interfaces/repositories/room.repository.interface";
import { IRoom } from "../types/IRoom";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import { IRoomService } from "../interfaces/services/room.service.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IUser } from "../types/IUser";
import { HttpStatus } from "../constants/enum.statusCode";
import { io } from "../app";
import { IRoomSessionRepository } from "../interfaces/repositories/room.session.repository.interface";
import { IRoomSession } from "../types/IRoomSession";
import { RoomSchema } from "../dtos/user/room/createRoom.dto";

export class RoomService implements IRoomService {
  constructor(
    private _roomRepo: IRoomRepository<IRoom>,
    private _userBaseRepo: IUserBaseRepository<IUser>,
    private _roomSession: IRoomSessionRepository<IRoomSession>
  ) {}

  async createRoom(host: Types.ObjectId, data: RoomSchema) {
    try {
      const roomData: any = {};
      const hostId = String(host);
      const hostData = await this._userBaseRepo.findById(hostId);

      const rooms = await this._roomRepo.findByHostId(host);

      const isAuthorisedForUnlimitedCreation = hostData?.premiumBenefits?.some(
        (benefit) => benefit.benefitKeys.includes("unlimited_room_creation")
      );
      if (hostData?.isVerified && !isAuthorisedForUnlimitedCreation) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Upgrade your Premium to get Unlimited room creation feature"
        );
      }
      if (!isAuthorisedForUnlimitedCreation && rooms.length >= 1) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST, 
          "Premium feature: You can only create one room at a time!"
        );
      }
      const isAuthorisedPremiumRoomCreation = hostData?.rewards.some(
        (reward) => reward.benefitKey == "premium_room_creation"
      );

      if (
        !hostData?.isVerified &&
        data.isPremium == "Yes" &&
        !isAuthorisedPremiumRoomCreation
      ) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Can't create premium rooms"
        );
      }

      roomData.startedAt = new Date();
      roomData.status = "online";
      roomData.roomId = nanoid(8);
      roomData.host = host;
      return this._roomRepo.createRoom({ ...roomData, ...data });
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(roomId: string, data: RoomSchema) {
    try {
      const room = await this._roomRepo.findSelectedRoom(false, roomId);
      if (!room)
        throw createHttpError(HttpStatus.NOT_FOUND, "Room not founded");
      const hostId = String(room.host);
      const host = await this._userBaseRepo.findById(hostId);
      const isAuthorisedPremiumRoomCreation = host?.rewards.some(
        (reward) => reward.benefitKey == "premium_room_creation"
      );
      if (
        !host?.isVerified &&
        data.isPremium == "Yes" &&
        !isAuthorisedPremiumRoomCreation
      ) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Premium feature: Can't set as premium room"
        );
      }

      const updatedData: Partial<IRoom> = {
        title: data.title,
        limit: data.limit,
        isPrivate: data.isPrivate,
        password: data.password,
        isPremium: data.isPremium,
        description: data.description,
      };

      await this._roomRepo.updateRoom(roomId, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async fetchMyRooms(id: Types.ObjectId) {
    try {
      const myRooms = await this._roomRepo.findByHostId(id);
      if (myRooms) return myRooms;
      else throw createHttpError(HttpStatus.NOT_FOUND, "My Rooms not founded");
    } catch (error) {
      throw error;
    }
  }

  async fetchRoomSession(
    roomId: string,
    data: { sort: string; search: string; page: number; limit: number }
  ): Promise<{ totalPages: number; session: IRoomSession[] | null }> {
    try {
      if (!roomId) {
        throw createHttpError(HttpStatus.NOT_FOUND, "Room id not founded");
      }
      const sessionData = await this._roomSession.getSelectedSession(
        roomId,
        data
      );

      if (!sessionData) return { totalPages: 1, session: null };

      return sessionData;
    } catch (error) {
      throw error;
    }
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
    try {
      const availableRoom = await this._roomRepo.findAvailableRooms(
        role,
        page,
        limit,
        id,
        filter,
        sort,
        search
      );
      if (availableRoom) return availableRoom;
      else throw createHttpError(HttpStatus.NOT_FOUND, "Rooms not founded");
    } catch (error) {
      throw error;
    }
  }

  async fetchSelectedRoom(role: string, id: string) {
    try {
      const room = await this._roomRepo.findSelectedRoom(role == "admin", id);
      if (!room)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "RoomId is incorrect, not found"
        );

      return room;
    } catch (error) {
      throw error;
    }
  }

  async removeRoom(id: string): Promise<boolean> {
    try {
      const roomId = await this._roomRepo.removeById(id);
      if (!roomId) {
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "RoomId not founded,while removing "
        );
      } else {
        io.to(roomId).emit("terminate-user", {
          message: "This room has been deleted by the admin.",
        });
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  async blockUser(roomDocId: string): Promise<boolean> {
    try {
      const { currentStatus, roomId } = await this._roomRepo.blockRoom(
        roomDocId
      );
      if (!roomId) {
        console.log("Not room id found to emit block event by blocking room");
      }
      if (!currentStatus) {
        io.to(roomId).emit("terminate-user", {
          message: "This room has been blocked by the admin.",
        });
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async joinRoom(
    userId: string,
    roomId: string
  ): Promise<"host" | "common" | undefined> {
    try {
      if (!userId)
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "Not Authenticated to join"
        );
      const room = await this._roomRepo.findByRoomId(roomId);
      const user = await this._userBaseRepo.findById(userId);
      if (!room) throw createHttpError(HttpStatus.NOT_FOUND, "Room not found");

      if (room.host.toString() == userId) {
        console.log("Host joined the room");
        return "host";
      }

      // if (room.participants.some((p) => p?.user?.toString() === userId)) {
      //   return; // already in room
      // }

      if (room.isBlocked) {
        throw createHttpError(HttpStatus.FORBIDDEN, "Room is unavailable");
      }
      if (!user?.isVerified && room.isPremium == "Yes") {
        throw createHttpError(
          HttpStatus.FORBIDDEN,
          "Only premium members can join"
        );
      }

      // if (room.participants.length >= room.limit) {
      //   throw createHttpError(HttpStatus.FORBIDDEN, "Room is full");
      // }

      const userLastJoined = await this._roomRepo.getLastJoinedTime(
        roomId,
        userId
      );

      const joinedAt = new Date();

      const userSessionData = {
        userId,
        roomId,
        startTime: joinedAt,
      };
      await this._roomSession.createSession(userSessionData);

      const isAdded = await this._roomRepo.addOrUpdateParticipant(
        userId,
        roomId,
        joinedAt
      );

      if (!isAdded)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Failed to add Participant"
        );

      if (userLastJoined) {
        let currentDate = new Date();
        const startDate = await this._roomSession.getLatestSession(
          userId,
          userLastJoined
        );
        if (!startDate) {
          console.log("Start Date is not get", startDate);
          return;
        }
        const timeSpend = Number(
          Math.floor(
            (currentDate.getTime() - startDate?.startTime.getTime()) / 1000
          )
        );
        await this._roomRepo.updateParticipantDuration(
          roomId,
          userId,
          timeSpend
        );

        await this._roomSession.updateRoomSessionDuration(
          roomId,
          userId,
          timeSpend,
          userLastJoined
        );
      }
      return "common";
    } catch (error) {
      throw error;
    }
  }

  async updateOnleaveRoom(roomId: string, userId: string): Promise<boolean> {
    try {
      if (!userId || !roomId) {
        console.log(
          "updateOnleaveRoom, userId or roomId is missing",
          userId,
          roomId
        );
        return false;
      }
      console.log(roomId, userId);
      const userLastJoined = await this._roomRepo.getLastJoinedTime(
        roomId,
        userId
      );

      if (!userLastJoined) {
        console.log("updateOnleaveRoom, userLastJoined is :", userLastJoined);
        return false;
      }
      let currentDate = new Date();
      const startDate = await this._roomSession.getLatestSession(
        userId,
        userLastJoined
      );
      if (!startDate) {
        console.log("Start Date is not get", startDate);
        return false;
      }
      const timeSpend = Number(
        Math.floor(
          (currentDate.getTime() - startDate?.startTime.getTime()) / 1000
        )
      );
      await this._roomRepo.updateParticipantDuration(roomId, userId, timeSpend);

      await this._roomSession.updateRoomSessionDuration(
        roomId,
        userId,
        timeSpend,
        userLastJoined
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(roomId: string, password: string) {
    try {
      if (!roomId || !password) {
        console.log("Room id or password is missing!");
        return;
      }
      const room = await this._roomRepo.findByRoomId(roomId);
      if (!room) throw createHttpError(HttpStatus.NOT_FOUND, "Room not found");

      if (room.password != password) {
        throw createHttpError(HttpStatus.UNAUTHORIZED, "Invalid Password ");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
