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
      return await Notification.find({
        sender: senderId,
        status: "pending",
      }).populate("reciever");
    } catch (error) {
      throw error;
    }
  }

  async getNotificationById(
    notificationId: string
  ): Promise<INotification | null> {
    try {
      return await Notification.findById(notificationId);
    } catch (error) {
      throw error;
    }
  }

  async getNotificationByReceiverId(
    recieverId: string
  ): Promise<INotification[]> {
    try {
      return await Notification.find({
        reciever: recieverId,
        status: "pending",
      }).populate("sender");
    } catch (error) {
      throw error;
    }
  }
  async rejectConnectionRequestById(
    notificationId: string
  ): Promise<INotification | null> {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { status: "rejected" },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
  async acceptConnectionRequestById(
    notificationId: string
  ): Promise<INotification | null> {
    try {
      return await Notification.findByIdAndUpdate(
        notificationId,
        { status: "resolved" },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}
