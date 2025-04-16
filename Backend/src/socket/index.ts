import { Server } from "socket.io";
import { registerRoomEvents } from "./handler/room.events";
import { socketAuth } from "./middleware/auth";
import { registerChatEvents } from "./handler/chat.events";

const initializeSocket = (io: Server) => {
  io.use(socketAuth);
  const onlineUsers = new Map<string, string>();
  io.on("connection", (socket) => {
    const userName = socket.data.user?.userName;

    console.log("User connected:", userName);
    const userId = socket.data.user?.userId;
    onlineUsers.set(userId, socket.id);

    registerRoomEvents(io, socket);
    registerChatEvents(io, socket, onlineUsers);
 
    socket.on("disconnect", (reason) => {
      if (userId) {
        onlineUsers.delete(userId);
        const friendIds = socket.data.friendIds || new Set();
        for (const friendId of friendIds) {
          const friendSocketId = onlineUsers.get(friendId);
          if (friendSocketId) {
            io.to(friendSocketId).emit("friend-offline", userId);
          }
        }
        console.log(`User disconnected: ${userId} ${reason}`);
      }
    });
  });
};

export default initializeSocket;
