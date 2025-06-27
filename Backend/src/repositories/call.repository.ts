import { ICallRepository } from "../interfaces/repositories/call.repository.interface.js";
import { CallLog } from "../models/callLogs.model.js";
import { ICallLog } from "../types/ICallLog.js";
import { BaseRepository } from "./base.repository.js";

export class CallRepository
  extends BaseRepository<ICallLog>
  implements ICallRepository<ICallLog>
{
  constructor() {
    super(CallLog);
  }
  async createCallLog(data: {
    initiator: string;
    reciever: string;
    status: "completed" | "rejected" | "missed";
  }): Promise<void> {
    try {
      await this.model.create(data);
      // await CallLog.create(data);
    } catch (error) {
      throw error;
    }
  }

  async findOneAndUpdateStatus(
    initiator: string,
    reciever: string,
    status: "completed" | "rejected" | "missed"
  ): Promise<void> {
    try {
      await CallLog.findOneAndUpdate(
        {
          $or: [
            { initiator, reciever },
            { initiator: reciever, reciever: initiator },
          ],
        },
        { status },
        { sort: { createdAt: -1 } }
      );
    } catch (error) {
      throw error;
    }
  }

  async getCallLogs(userId: string): Promise<ICallLog[]> {
    try {
      return await CallLog.find({
        $or: [{ initiator: userId }, { reciever: userId }],
      })
        .populate("initiator", "userName avatar firstName") // Adjust fields as needed
        .populate("reciever", "userName avatar firstName")
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
}
