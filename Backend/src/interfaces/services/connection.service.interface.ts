import { FetchCallLogsDTO } from "../../dtos/user/connection/fetchCallLogs.dto";
import { ResGetFriendDTO } from "../../dtos/user/connection/useGetFriends.dto";
import { GetMessageDTO } from "../../dtos/user/connection/useGetMessage.dto";
import { ResGetNotificationDTO } from "../../dtos/user/connection/useGetNotification.dto";

export interface IConnectionService {
  sendConnectionRequest(
    senderId: string,
    recieverUserName: string
  ): Promise<void>;
  deleteMessage(messageId: string): Promise<string>;
  getUnreadMessageCount(userId: string): Promise<number>;
  toggleIsRead(messageId: string): Promise<void>;
  getConnectionRequests(userId: string): Promise<string[]>;
  unfollow(userId: string, freindUserName: string): Promise<void>;
  rejectRequest(requestId: string): Promise<void>;
  acceptRequest(requestId: string): Promise<void>;
  getNotifications(userId: string): Promise<ResGetNotificationDTO>;
  getAllConnections(userId: string, search: string): Promise<ResGetFriendDTO>;
  sendMessage(
    userId: string,
    friendId: string,
    content: string
  ): Promise<string>;
  getMessages(userId: string, friendId: string): Promise<GetMessageDTO>;
  fetchCallLogs(userId: string): Promise<FetchCallLogsDTO[]>;
  removeReaction(
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void>;
  addReaction(messageId: string, emoji: string, userId: string): Promise<void>;
}
