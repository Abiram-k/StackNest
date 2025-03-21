import { Server, Socket } from "socket.io";
import { RoomService } from "../../services/room.service";
import { RoomRespository } from "../../repositories/room.repository";
import { UserBaseRepository } from "../../repositories/user.repository";

const roomRepo = new RoomRespository();
const userBaseRepo = new UserBaseRepository();
const roomService = new RoomService(roomRepo, userBaseRepo);

interface IRoomData {
  [roomId: string]: {
    userId: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isVideoOn: boolean;
  }[];
}

let roomData: IRoomData = {};

export const registerRoomEvents = (io: Server, socket: Socket) => {
  socket.on("join-room", (roomId: string) => {
    const userId = socket.data.user?.userId;
    const userName = socket.data.user?.userName;
    const avatar = socket.data.user?.avatar;
    if (!userId) {
      socket.emit("error", "User is not Authorized");
      console.log("User is not Authorized");
      return;
    }
    if (!roomId) {
      socket.emit("error", "Room ID is invalid");
      return;
    }
    socket.join(roomId);
    console.log(`User ${userName} is joining room: ${roomId}`);
    console.log("Room Data: ", roomData);

    if (!roomData[roomId]) {
      roomData[roomId] = [
        { userId, name: userName, avatar, isMuted: false, isVideoOn: false },
      ];
    } else {
      if (!roomData[roomId].some((user) => user.userId == userId))
        roomData[roomId].push({
          userId,
          name: userName,
          avatar,
          isMuted: false,
          isVideoOn: false,
        });
    }
    console.log("Before emit");
    io.to(roomId).emit("participants", roomData[roomId]);
    console.log("After emit");
    console.log(roomData[roomId]);
    socket.to(roomId).emit("room-message", `${userName} joined room`);
  });

  socket.on("leave-room", (roomId: string) => {
    const userName = socket.data.user?.userName;
    roomData[roomId] = roomData[roomId].filter(
      (user) => user.name !== userName
    );
    io.to(roomId).emit("participants", roomData[roomId] || []);
    socket.leave(roomId);
    socket.to(roomId).emit("room-message", `${userName} left the room`);
    console.log(`User ${userName} left room: ${roomId}`);
  });
};
