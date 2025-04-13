import { Types } from "mongoose";

export interface INotificationRepository<T> {
  sendConnectionRequest(
    senderId: string,
    recieverId: Types.ObjectId
  ): Promise<void>;
  getConnectionRequestBySenderId(senderId: string): Promise<T[]>;
  getNotificationByReceiverId(recieverId: string): Promise<T[]>;
}
