import { Server, Socket } from "socket.io";
import { ConnectionService } from "../../services/connection.service.js";
import { IConnectionService } from "../../interfaces/services/connection.service.interface.js";
import { IMessageRepository } from "../../interfaces/repositories/message.repository.interface.js";
import { IMessage } from "../../types/IMessage.js";
import { MessageRepository } from "../../repositories/message.repository.js";
import { IUserBaseRepository } from "../../interfaces/repositories/user.repository.interface.js";
import { IUser } from "../../types/IUser.js";
import { UserBaseRepository } from "../../repositories/user.repository.js";
import { INotificationRepository } from "../../interfaces/repositories/notification.repository.interface.js";
import { INotification } from "../../types/INotification.js";
import { NotificationRepository } from "../../repositories/notification.repository.js";
import { isImageUrl, isVideoUrl } from "../../utils/urlChecker.js";
import { ICallRepository } from "../../interfaces/repositories/call.repository.interface.js";
import { ICallLog } from "../../types/ICallLog.js";
import { CallRepository } from "../../repositories/call.repository.js";

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
// const callRepo: ICallRepository<ICallLog> = new CallRepository();
const callLogRepo: ICallRepository<ICallLog> = new CallRepository();
const connectionService: IConnectionService = new ConnectionService(
  notificationRepo,
  userBaseRepo,
  messageRepo,
  callLogRepo
);

const userSocketMap = new Map<string, string>();

interface CallSignal {
  type: "offer" | "answer" | "candidate";
  content: any;
  to: string;
}

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

  socket.on("message-deleted", (messageId, friendId) => {
    const chatId = getChatId(userId, friendId);
    io.to(chatId).emit("message-delete", messageId);
  });

  // Call
  socket.on("signal", async (data: CallSignal) => {
    const callerName = socket.data.user.userName;
    const callerAvatar = socket.data.user.avatar;
    const toSocketId = onlineUsers.get(data.to);
    if (!toSocketId) {
      console.log("No socket id finded (signal)");
      return;
    }
    if (data.type === "offer") {
      try {
        io.to(toSocketId).emit("incoming-calll",userId)
        console.log("Saving call to db 🤖");
        await callLogRepo.createCallLog({
          initiator: userId,
          reciever: data.to,
          status: "missed",
        });
      } catch (err) {
        console.error("Error saving call log:", err);
      }
    }

    io.to(toSocketId).emit("signal", {
      type: data.type,
      content: data.content,
      from: userId,
      callerName,
      callerAvatar,
    });
  });

  socket.on("rejectCall", async (data: { to: string }) => {
    const toSocketId = onlineUsers.get(data.to);
    try {
      console.log("Updating call status to rejected");
      await callLogRepo.findOneAndUpdateStatus(userId, data.to, "rejected");
    } catch (error) {
      console.error("Error updating call log on reject:", error);
    }
    if (!toSocketId) {
      console.log("No socket id finded (reject call)");
      return;
    }
    io.to(toSocketId).emit("callRejected");
  });

  socket.on("call-end", async ({ to }) => {
    const from = userId;
    const toSocketId = onlineUsers.get(to);
    try {
      console.log("Updating call status to completed");
      await callLogRepo.findOneAndUpdateStatus(userId, to, "completed");
    } catch (error) {
      console.error("Error updating call log on call-end:", error);
    }

    if (!toSocketId) {
      console.log("No socket id finded (call-end)");
      return;
    }
    io.to(toSocketId).emit("call-ended", { from });
  });

  socket.on("call-accepted", ({ to }) => {
    const from = socket.data.user?.userId;
    const callerName = socket.data.user.userName;
    const callerAvatar = socket.data.user.avatar;
    const toSocketId = onlineUsers.get(to);
    if (!toSocketId) {
      console.log("No socket id finded (call-accepted)");
      return;
    }
    io.to(toSocketId).emit("call-accepted", { from, callerName, callerAvatar });
  });

  socket.on("delete-reaction", async (messageId, emoji, friendId) => {
    await connectionService.removeReaction(messageId, emoji, userId);
    const chatId = getChatId(userId, friendId);
    io.to(chatId).emit("reaction-removed", messageId, emoji, userId);
  });

  socket.on("add-reaction", async (messageId, emoji, friendId) => {
    await connectionService.addReaction(messageId, emoji, userId);
    const chatId = getChatId(userId, friendId);
    io.to(chatId).emit("new-reaction", messageId, emoji, userId);
  });

  // socket.on("exit-chat", (friendId: string) => {
  //   console.log("From exit chat event, FriendId: ", friendId);
  //   const friendSocketId = onlineUsers.get(friendId);
  //   if (friendSocketId) {
  //     io.to(friendSocketId).emit("friend-offline", userId);
  //   }
  // });
};
