import { ICallRepository } from "../interfaces/repositories/call.repository.interface.js";
import { CallLog } from "../models/callLogs.model.js";
import { ICallLog } from "../types/ICallLog.js";

export class CallRepository implements ICallRepository<ICallLog> {
  async createCallLog(data: {
    initiator: string;
    reciever: string;
    status: "completed" | "rejected" | "missed";
  }): Promise<void> {
    try {
      await CallLog.create(data);
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
      console.log("From repository, updating status to:", status);

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
