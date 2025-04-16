import { Server, Socket } from "socket.io";
import { ConnectionService } from "../../services/connection.service";
import { IConnectionService } from "../../interfaces/services/connection.service.interface";
import { IMessageRepository } from "../../interfaces/repositories/message.repository.interface";
import { IMessage } from "../../types/IMessage";
import { MessageRepository } from "../../repositories/message.repository";
import { IUserBaseRepository } from "../../interfaces/repositories/user.repository.interface";
import { IUser } from "../../types/IUser";
import { UserBaseRepository } from "../../repositories/user.repository";
import { INotificationRepository } from "../../interfaces/repositories/notification.repository.interface";
import { INotification } from "../../types/INotification";
import { NotificationRepository } from "../../repositories/notification.repository";
import { isImageUrl, isVideoUrl } from "../../utils/urlChecker";

interface MsgUser {
  _id: string;
  name: string;
  avatar: string;
}
interface MessageChat {
  id: string;
  senderId: string;
  message: string;
  type: "text" | "image" | "video";
  isRead: boolean;
}
type GetMessageRes = {
  friendData: MsgUser;
  userData: MsgUser;
  messages: MessageChat[];
};
const notificationRepo: INotificationRepository<INotification> =
  new NotificationRepository();
const userBaseRepo: IUserBaseRepository<IUser> = new UserBaseRepository();
const messageRepo: IMessageRepository<IMessage> = new MessageRepository();
const connectionService: IConnectionService = new ConnectionService(
  notificationRepo,
  userBaseRepo,
  messageRepo
);
const userSocketMap = new Map<string, string>();

const getChatId = (userId: string, friendId: string) =>
  [userId, friendId].sort().join("-");

export const registerChatEvents = (
  io: Server,
  socket: Socket,
  onlineUsers: Map<string, string>
) => {
  const userId = socket.data.user?.userId;
  socket.data.friendIds = new Set<string>();

  if (userId) {
    userSocketMap.set(userId, socket.id);
    socket.join(userId);
  }

  socket.on("join-chat", (friendId: string) => {
    const userId = socket.data.user?.userId;
    const chatRoomId = getChatId(userId, friendId);
    socket.join(chatRoomId);
    socket.data.friendIds.add(friendId);
    const friendSocketId = onlineUsers.get(friendId);
    if (friendSocketId) {
      io.to(friendSocketId).emit("friend-online", userId); // sending user id to friend, if the friend is in online
    }
    const isFriendOnline = onlineUsers.has(friendId);
    socket.emit("is-friend-online", isFriendOnline);
  });

  socket.on("send-message", async (friendId: string, content: string) => {
    const userId = socket.data.user?.userId;
    const messageId = await connectionService.sendMessage(
      userId,
      friendId,
      content
    );
    const chatId = getChatId(userId, friendId);
    let type: "text" | "image" | "video" = "text";
    if (isImageUrl(content)) type = "image";
    else if (isVideoUrl(content)) type = "video";
    else type = "text";
    const newMessage: MessageChat = {
      id: messageId,
      senderId: userId,
      isRead: false,
      message: content,
      type,
    };
    io.to(chatId).emit("new-message", newMessage);
  });
  socket.on("read-message-success", (messageId, friendId) => {
    const userId = socket.data.user?.userId;
    const chatId = getChatId(userId, friendId);
    io.to(chatId).emit("message-read", messageId);
  });

  // socket.on("exit-chat", (friendId: string) => {
  //   console.log("From exit chat event, FriendId: ", friendId);
  //   const friendSocketId = onlineUsers.get(friendId);
  //   if (friendSocketId) {
  //     io.to(friendSocketId).emit("friend-offline", userId);
  //   }
  // });
};
