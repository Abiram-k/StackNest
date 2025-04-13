import { HttpStatus } from "../constants/enum.statusCode";
import { INotificationRepository } from "../interfaces/repositories/notification.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IConnectionService } from "../interfaces/services/connection.service.interface";
import { INotification } from "../types/INotification";
import createHttpError from "http-errors";
import { IUser } from "../types/IUser";
import { Types } from "mongoose";
import { sendNotification } from "../utils/webPush";

export class ConnectionService implements IConnectionService {
  private _notificationRepo: INotificationRepository<INotification>;
  private _userBaseRepo: IUserBaseRepository<IUser>;
  constructor(
    notificationRepo: INotificationRepository<INotification>,
    userBaseRepo: IUserBaseRepository<IUser>
  ) {
    this._notificationRepo = notificationRepo;
    this._userBaseRepo = userBaseRepo;
  }

  async sendConnectionRequest(
    senderId: string,
    recieverUserName: string
  ): Promise<void> {
    try {
      if (!senderId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "Sender id not founded");
      if (!recieverUserName)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Reciever userName not founded"
        );
      const reciever = await this._userBaseRepo.findByUserName(
        recieverUserName
      );
      const sender = await this._userBaseRepo.findById(senderId);
      if (!sender)
        throw createHttpError(HttpStatus.NOT_FOUND, "Sender  not founded");
      if (!reciever)
        throw createHttpError(HttpStatus.NOT_FOUND, "Reciever  not founded");
      await this._notificationRepo.sendConnectionRequest(
        senderId,
        reciever._id
      );

      const payload = {
        title: "New Connection Request!",
        body: `${sender?.userName} sended a connection request`,
        icon: sender?.avatar,
        url: `/user/profile/notification`,
      };
      if (reciever && reciever?.pushSubscriptions.length > 0) {
        await Promise.all(
          reciever.pushSubscriptions.map((subscription) =>
            sendNotification(
              { endpoint: subscription.endpoint, keys: subscription.keys },
              payload
            )
          )
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getConnectionRequests(userId: string): Promise<string[]> {
    try {
      const notifications =
        await this._notificationRepo.getConnectionRequestBySenderId(userId);
      const requestedUserNames = notifications.map((notification) => {
        if (notification.reciever instanceof Types.ObjectId) {
          throw createHttpError(
            HttpStatus.BAD_REQUEST,
            "Reciever is not populated"
          );
        }
        return notification.reciever.userName;
      });
      return requestedUserNames;
    } catch (error) {
      throw error;
    }
  }

  async getNotifications(userId: string): Promise<ResGetNotificationDTO> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not founded");
      const notificationsData =
        await this._notificationRepo.getNotificationByReceiverId(userId);
      const notifications: notificationType[] = notificationsData.map(
        (notification) => {
          if (notification.sender instanceof Types.ObjectId) {
            throw createHttpError(
              HttpStatus.BAD_REQUEST,
              "Sender is not populated"
            );
          }
          return {
            notificationId: String(notification._id),
            sender: {
              avatar: notification.sender.avatar,
              userName: notification.sender.userName,
            },
            sendedAt: notification.createdAt,
          };
        }
      );
      return { notifications };
    } catch (error) {
      throw error;
    }
  }
}
