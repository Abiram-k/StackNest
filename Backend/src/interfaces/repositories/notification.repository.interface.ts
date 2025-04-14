import { Types } from "mongoose";

export interface INotificationRepository<T> {
  sendConnectionRequest(
    senderId: string,
    recieverId: Types.ObjectId
  ): Promise<void>;
  getConnectionRequestBySenderId(senderId: string): Promise<T[]>;
  getNotificationById(notificationId: string): Promise<T | null>;
  rejectConnectionRequestById(notificationId: string): Promise<T | null>;
  acceptConnectionRequestById(notificationId: string): Promise<T | null>;
  getNotificationByReceiverId(recieverId: string): Promise<T[]>;
}
