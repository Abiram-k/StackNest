import { IRoomSessionRepository } from "../interfaces/repositories/room.session.repository.interface.js";
import RoomSession from "../models/room.session.model.js";
import { IRoomSession } from "../types/IRoomSession.js";

export class RoomSessionRespository
  implements IRoomSessionRepository<IRoomSession>
{
  async createSession(sessionData: {
    userId: string;
    roomId: string;
    startTime: Date;
  }): Promise<void> {
    try {
      await RoomSession.create(sessionData);
    } catch (error) {
      throw error;
    }
  }
  async getAllSession(): Promise<IRoomSession[] | null> {
    try {
      return await RoomSession.find();
    } catch (error) {
      throw error;
    }
  }

  async getLatestSession(
    userId: string,
    startTime: Date
  ): Promise<IRoomSession | null> {
    try {
      return await RoomSession.findOne({ userId, startTime });
    } catch (error) {
      throw error;
    }
  }

  async updateRoomSessionDuration(
    roomId: string,
    userId: string,
    duration: number,
    userLastJoined: Date
  ): Promise<boolean> {
    try {
      const result = await RoomSession.findOneAndUpdate(
        {
          roomId,
          userId,
          startTime: userLastJoined,
        },
        {
          $set: {
            endTime: new Date(),
            duration: duration,
          },
        },
        { new: true }
      );

      return !!result;
    } catch (error) {
      console.error("Error updating room session duration:", error);
      throw error;
    }
  }

  async getSelectedSession(
    roomId: string,
    data: { sort: string; search: string; page: number; limit: number }
  ): Promise<{ totalPages: number; session: IRoomSession[] }> {
    try {
      const { sort, limit, page, search } = data;
      const query: any = {};
      if (search) {
        query.$or = [{ "userId.userName": { $regex: search, $options: "i" } }];
      }
      query.roomId = roomId;

      const totalSession = await RoomSession.countDocuments(query);
      const totalPages = Math.ceil(totalSession / limit);

      const session = await RoomSession.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "userName avatar");

      return { session, totalPages };
      
    } catch (error) {
      throw error;
    }
  }
}
