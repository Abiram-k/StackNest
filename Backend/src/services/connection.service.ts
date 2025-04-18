import { HttpStatus } from "../constants/enum.statusCode";
import { INotificationRepository } from "../interfaces/repositories/notification.repository.interface";
import { IUserBaseRepository } from "../interfaces/repositories/user.repository.interface";
import { IConnectionService } from "../interfaces/services/connection.service.interface";
import { INotification } from "../types/INotification";
import createHttpError from "http-errors";
import { IUser } from "../types/IUser";
import { Types } from "mongoose";
import { sendNotification } from "../utils/webPush";
import { IMessageRepository } from "../interfaces/repositories/message.repository.interface";
import { IMessage } from "../types/IMessage";
import { GetMessageDTO } from "../dtos/user/connection/useGetMessage.dto";
import { isImageUrl, isVideoUrl } from "../utils/urlChecker";
import { FetchCallLogsDTO } from "../dtos/user/connection/fetchCallLogs.dto";
import { ICallRepository } from "../interfaces/repositories/call.repository.interface";
import { ICallLog } from "../types/ICallLog";

export class ConnectionService implements IConnectionService {
  private _notificationRepo: INotificationRepository<INotification>;
  private _userBaseRepo: IUserBaseRepository<IUser>;
  private _messageRepo: IMessageRepository<IMessage>;
  private _callRepo: ICallRepository<ICallLog>;
  constructor(
    notificationRepo: INotificationRepository<INotification>,
    userBaseRepo: IUserBaseRepository<IUser>,
    messageRepo: IMessageRepository<IMessage>,
    callRepo: ICallRepository<ICallLog>
  ) {
    this._notificationRepo = notificationRepo;
    this._userBaseRepo = userBaseRepo;
    this._messageRepo = messageRepo;
    this._callRepo = callRepo;
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
      // const user = await this._userBaseRepo.findById(userId);
      // if (!user)
      //   throw createHttpError(
      //     HttpStatus.UNAUTHORIZED,
      //     "User not founded (getconnectionReq)"
      //   );
      // const friends = user.friends;
      // const freindsUserName: string[] = friends
      //   .map((friend) => {
      //     if (typeof friend === "string" || friend instanceof Types.ObjectId)
      //       return null;
      //     return friend.userName;
      //   })
      //   .filter((userName) => userName != null);

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

  async rejectRequest(requestId: string): Promise<void> {
    try {
      if (!requestId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Request Id not founded");
      const notification =
        await this._notificationRepo.rejectConnectionRequestById(requestId);
      if (!notification)
        throw createHttpError(HttpStatus.NOT_FOUND, "Failed to reject request");
    } catch (error) {
      throw error;
    }
  }

  async acceptRequest(requestId: string): Promise<void> {
    try {
      if (!requestId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Request Id not founded");
      const notification =
        await this._notificationRepo.acceptConnectionRequestById(requestId);
      if (!notification)
        throw createHttpError(HttpStatus.NOT_FOUND, "Failed to accept request");
      const freindId = notification.sender;
      const recieverId = notification.reciever;
      if (
        !(recieverId instanceof Types.ObjectId) ||
        !(freindId instanceof Types.ObjectId)
      ) {
        console.log("Invalid ObjectId(s)");
        return;
      }
      const isAlreayFriend = await this._userBaseRepo.isAlreadyFreind(
        recieverId,
        freindId
      );
      if (isAlreayFriend)
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "Already in your connection"
        );

      const sender = await this._userBaseRepo.findById(String(freindId));
      const reciever = await this._userBaseRepo.findById(String(recieverId));
      const payload = {
        title: " Connection Request Accepted!",
        body: `${reciever?.userName} accepted your connection request`,
        icon: reciever?.avatar,
        url: `/user/${reciever?.userName}/view`,
      };
      if (sender && sender?.pushSubscriptions.length > 0) {
        await Promise.all(
          sender.pushSubscriptions.map((subscription) =>
            sendNotification(
              { endpoint: subscription.endpoint, keys: subscription.keys },
              payload
            )
          )
        );
      }
      if (!freindId)
        throw createHttpError(HttpStatus.NOT_FOUND, "FreindId not founded");

      await this._userBaseRepo.addNewFriend(recieverId, freindId);
      await this._userBaseRepo.addNewFriend(freindId, recieverId);
    } catch (error) {
      throw error;
    }
  }

  async unfollow(userId: string, friendUserName: string): Promise<void> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not founded");
      if (!friendUserName)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "friend userName not founded"
        );
      const friend = await this._userBaseRepo.findByUserName(friendUserName);
      if (!friend)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Enable to find friend data"
        );
      const friendId = String(friend._id);
      await this._userBaseRepo.removeFreind(userId, friendId);
      await this._userBaseRepo.removeFreind(friendId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getAllConnections(
    userId: string,
    search: string
  ): Promise<ResGetFriendDTO> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "UserId not founded");

      const user = await this._userBaseRepo.getAllFriends(userId, search);
      if (!user)
        throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
      const friends: FriendsRes[] = await Promise.all(
        user.friends
          .filter(
            (friend): friend is IUser => !(friend instanceof Types.ObjectId)
          )
          .map(async (friend) => {
            const messages = await this._messageRepo.getMessages(
              userId,
              String(friend._id)
            );
            const unReadMessageCount: number =
              await this._messageRepo.getUnreadMessagesCount(
                userId,
                String(friend._id)
              );
            const lastMessageData: IMessage | null = messages.length
              ? messages.slice(-1)[0]
              : null;
            let isUserSendedLastMessage =
              lastMessageData && String(lastMessageData.sender) == userId
                ? true
                : false;
            const lastMessage = lastMessageData
              ? `${isUserSendedLastMessage ? "You: " : ""} ${
                  lastMessageData.content.length >= 20
                    ? lastMessageData.content.slice(0, 20) + "..."
                    : lastMessageData.content
                }`
              : "";
            const lastMessageAt = lastMessageData
              ? lastMessageData.createdAt
              : null;
            return {
              friendId: String(friend._id),
              avtar: friend.avatar,
              firstName: friend.firstName,
              lastMessage,
              lastMessageAt,
              userName: friend.userName,
              unReadMessageCount,
            };
          })
      );

      const isMyChatThere =
        (await this._messageRepo.getMessages(userId, userId)).length && !search;
      if (isMyChatThere) {
        const user = await this._userBaseRepo.findById(userId);
        if (!user)
          throw createHttpError(HttpStatus.NOT_FOUND, "Failed to find user");
        const messages = await this._messageRepo.getMessages(userId, userId);
        const lastMessageData: IMessage | null = messages.length
          ? messages.slice(-1)[0]
          : null;
        let isUserSendedLastMessage =
          lastMessageData && String(lastMessageData.sender) == userId
            ? true
            : false;
        const lastMessage = lastMessageData
          ? `${isUserSendedLastMessage ? "You: " : ""} ${
              lastMessageData.content.length >= 20
                ? lastMessageData.content.slice(0, 20) + "..."
                : lastMessageData.content
            }`
          : "";
        const lastMessageAt = lastMessageData
          ? lastMessageData.createdAt
          : null;
        const myChatData: FriendsRes = {
          avtar: user.avatar,
          userName: user.userName,
          firstName: user.firstName,
          friendId: String(user._id),
          lastMessage,
          lastMessageAt,
          unReadMessageCount: 0,
        };
        friends.push(myChatData);
      }

      return { friends };
    } catch (error) {
      throw error;
    }
  }

  // Message

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "Userid not founded");
      const count = await this._messageRepo.getUnreadMessageCount(userId);
      return count;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(
    userId: string,
    friendId: string,
    content: string
  ): Promise<string> {
    try {
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not founded");
      if (!friendId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Friend Id not founded");
      if (!content)
        throw createHttpError(HttpStatus.NOT_FOUND, "Content not founded");
      content = content.trim();
      let type: "text" | "image" | "video" = "text";
      if (isImageUrl(content)) type = "image";
      else if (isVideoUrl(content)) type = "video";
      else type = "text";
      const message = await this._messageRepo.createMessage(
        userId,
        friendId,
        content,
        type
      );
      const friendData = await this._userBaseRepo.findById(friendId);
      const userData = await this._userBaseRepo.findById(userId);
      if (!userData)
        throw createHttpError(HttpStatus.NOT_FOUND, "Failed to find User");
      if (!friendData)
        throw createHttpError(HttpStatus.NOT_FOUND, "Failed to find friend");
      if (userId !== friendId) {
        const payload = {
          title: "New Message ",
          body: content.length > 30 ? content.slice(0, 30) + "..." : content,
          icon: userData.avatar,
          url: `/user/messaging?friend=${userData._id}`,
        };
        if (friendData && friendData?.pushSubscriptions.length > 0) {
          await Promise.all(
            friendData.pushSubscriptions.map((subscription) =>
              sendNotification(
                { endpoint: subscription.endpoint, keys: subscription.keys },
                payload
              )
            )
          );
        }
      }
      return message._id;
    } catch (error) {
      throw error;
    }
  }
  async getMessages(userId: string, friendId: string): Promise<GetMessageDTO> {
    if (!userId)
      throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not founded");
    if (!friendId)
      throw createHttpError(HttpStatus.NOT_FOUND, "Friend Id not founded");
    const friendData = await this._userBaseRepo.findById(friendId);
    if (!friendData)
      throw createHttpError(HttpStatus.NOT_FOUND, "Friend not founded");
    const userData = await this._userBaseRepo.findById(userId);
    if (!userData)
      throw createHttpError(HttpStatus.NOT_FOUND, "User not founded");
    const messages = await this._messageRepo.getMessages(userId, friendId);

    const data: GetMessageDTO = {
      friendData: {
        _id: String(friendData._id),
        name: friendData.firstName,
        avatar: friendData.avatar,
        userName: friendData.userName,
      },
      userData: {
        _id: String(userData._id),
        name: userData.firstName,
        avatar: userData.avatar,
        userName: userData.userName,
      },
      messages: messages.map((message) => ({
        id: message._id,
        senderId: String(message.sender._id),
        message: message.content,
        type: message.type,
        isRead: message.isRead,
        reactions:message.reactions
      })),
    };
    return data;
  }

  async toggleIsRead(messageId: string): Promise<void> {
    try {
      if (!messageId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Message id not founded");
      await this._messageRepo.toggleIsRead(messageId);
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<string> {
    try {
      if (!messageId)
        throw createHttpError(HttpStatus.NOT_FOUND, "Message id not founded");
      const recieverId = await this._messageRepo.findByAndDelete(messageId);
      if (!recieverId)
        throw createHttpError(HttpStatus.FORBIDDEN, "Failed to delete message");
      return recieverId;
    } catch (error) {
      throw error;
    }
  }

  async fetchCallLogs(userId: string): Promise<FetchCallLogsDTO[]> {
    try {
      if (!userId)
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          "User id not founded (calllog_Fetch)"
        );
      const callLogs = await this._callRepo.getCallLogs(userId);
      if (!callLogs.length) return [];
      const formattedData: FetchCallLogsDTO[] = callLogs
        .map((log) => {
          if (
            log.initiator instanceof Types.ObjectId ||
            log.reciever instanceof Types.ObjectId
          ) {
            console.log("Initiator or reciever not populated");
            return null;
          }
          const isMeInitiated: boolean = String(log.initiator._id) == userId;

          if (isMeInitiated) {
            return {
              firstName: log.reciever.firstName,
              userName: log.reciever.userName,
              avatar: log.reciever.avatar,
              status: log.status,
              isMeInitiated,
            };
          } else {
            return {
              firstName: log.initiator.firstName,
              userName: log.initiator.userName,
              avatar: log.initiator.avatar,
              status: log.status,
              isMeInitiated,
            };
          }
        })
        .filter((data) => data !== null);

      return formattedData;
    } catch (error) {
      throw error;
    }
  }

  async addReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    try {
      if (!messageId)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Message id not founded (add reaction)"
        );
      if (!emoji)
        throw createHttpError(HttpStatus.NOT_FOUND, "Emoji not founded");
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not fouded");
      await this._messageRepo.addReaction(messageId, emoji, userId);
    } catch (error) {
      throw error;
    }
  }
  async removeReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    try {
      if (!messageId)
        throw createHttpError(
          HttpStatus.NOT_FOUND,
          "Message id not founded (remove reaction)"
        );
      if (!emoji)
        throw createHttpError(HttpStatus.NOT_FOUND, "Emoji not founded");
      if (!userId)
        throw createHttpError(HttpStatus.UNAUTHORIZED, "User id not fouded");
      await this._messageRepo.removeReaction(messageId, emoji, userId);
    } catch (error) {
      throw error;
    }
  }
}
