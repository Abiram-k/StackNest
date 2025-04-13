import { Types } from "mongoose";
import { INotificationRepository } from "../interfaces/repositories/notification.repository.interface";
import { Notification } from "../models/notification.model";
import { INotification } from "../types/INotification";

export class NotificationRepository
  implements INotificationRepository<INotification>
{
  async sendConnectionRequest(
    senderId: string,
    recieverId: Types.ObjectId
  ): Promise<void> {
    try {
      await Notification.create({ sender: senderId, reciever: recieverId });
    } catch (error) {
      throw error;
    }
  }

  async getConnectionRequestBySenderId(
    senderId: string
  ): Promise<INotification[]> {
    try {
      return await Notification.find({ sender: senderId }).populate("reciever");
    } catch (error) {
      throw error;
    }
  }

  async getNotificationByReceiverId(
    recieverId: string
  ): Promise<INotification[]> {
    try {
      return await Notification.find({ reciever: recieverId }).populate(
        "sender"
      );
    } catch (error) {
      throw error;
    }
  }
}
