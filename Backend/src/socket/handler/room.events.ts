import { Server, Socket } from "socket.io";
import { RoomService } from "../../services/room.service";
import { RoomRespository } from "../../repositories/room.repository";
import { UserBaseRepository } from "../../repositories/user.repository";
import { Console } from "console";
import { RoomSessionRespository } from "../../repositories/room.session.repository";

const roomRepo = new RoomRespository();
const userBaseRepo = new UserBaseRepository();
const roomSessionRepo = new RoomSessionRespository();
const roomService = new RoomService(roomRepo, userBaseRepo, roomSessionRepo);

interface IRoomData {
  [roomId: string]: {
    socketId: string;
    name: string;
    avatar: string;
    isMuted: boolean;
    isVideoOn: boolean;
    isHandRised: boolean;
  }[];
}

let roomData: IRoomData = {};

const rooms = new Map<string, Set<string>>();

export const registerRoomEvents = (io: Server, socket: Socket) => {
  let currentRoomId: string;

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<  JOIN ROOM EVENT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("join-room", (roomId: string) => {
    currentRoomId = roomId;
    const userId = socket.data.user?.userId;
    const userName = socket.data.user?.userName;
    const avatar = socket.data.user?.avatar;

    if (!roomData[roomId]) {
      roomData[roomId] = [
        {
          socketId: socket.id,
          name: userName,
          avatar,
          isMuted: false,
          isVideoOn: false,
          isHandRised: false,
        },
      ];
    } else {
      if (!roomData[roomId].some((user) => user.socketId == socket.id))
        roomData[roomId].push({
          socketId: socket.id,
          name: userName,
          avatar,
          isMuted: false,
          isVideoOn: false,
          isHandRised: false,
        });
    }

    socket.join(roomId);

    io.to(roomId).emit("participants", roomData[roomId]);
    socket.to(roomId).emit("room-message", `${userName} joined room`);
    const peers = rooms.get(roomId) || new Set<string>();
    peers.add(socket.id);
    rooms.set(roomId, peers);
    socket.emit(
      "existing-peers",
      Array.from(peers).filter((id) => id !== socket.id)
    );
    socket.to(roomId).emit("new-peer", socket.id);
  });

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  SIGNALING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on(
    "signal",
    (data: {
      targetId: string;
      signal: any;
      type: "offer" | "answer" | "candidate";
    }) => {
      io.to(data.targetId).emit("signal", {
        senderId: socket.id,
        type: data.type,
        signal: data.signal,
      });
    }
  );

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<  LEAVE ROOM EVENT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("leave-room", async (roomId: string) => {
    console.log("LEAVE REQUEST GOT🌟");
    const userName = socket.data.user?.userName;
    const userId = socket.data.user?.userId;

    const isUpdated = await roomService.updateOnleaveRoom(roomId, userId);
    if (!isUpdated) {
      console.log("On leave event, duration is not updated");
      return;
    }
    roomData[roomId] = roomData[roomId]?.filter(
      (user) => user.name !== userName
    );
    io.to(roomId).emit("participants", roomData[roomId] || []);

    socket.leave(roomId);
    socket.to(roomId).emit("room-message", `${userName} left the room`);
    console.log(`User ${userName} left room: ${roomId}`);

    const peers = rooms.get(roomId);
    if (peers) {
      peers.delete(socket.id);
      if (peers.size == 0) rooms.delete(roomId);
      socket.to(roomId).emit("peer-disconnected", socket.id);
    }
  });

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<  HAND RISE EVENT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  socket.on(
    "hand-rise",
    ({ roomId, isHandRised }: { roomId: string; isHandRised: boolean }) => {
      const userId = socket.data.user?.userId;
      const userName = socket.data.user?.userName;
      if (!roomData[roomId]) {
        socket.emit("error", "Room does not exist.");
        return;
      }
      const userData = roomData[roomId].find(
        (user) => user.socketId === socket.id
      );
      if (!userData) {
        socket.emit("error", "User not found in the room.");
        return;
      }
      userData.isHandRised = isHandRised;
      io.to(roomId).emit("participants", roomData[roomId]);

      if (isHandRised) {
        socket
          .to(roomId)
          .emit("room-message", `${userName} raised their hand ✋`);
      }
    }
  );

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  REMOVE USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("room-removeUser", (socketId: string,roomId:string) => {
    const userName = socket.data.user?.userName;
    if (socket.id == socketId) {
      console.log("Bro your trying to kik yourself from the room !?");
      return;
    } else {
      console.log(`Removing user with ID: ${socketId}`);
      io.to(socketId).emit("terminate-user", {
        message: ` You were remove by host`,
      });
    }
  });
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CHAT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on(
    "send-message",
    (data: { message: string; timestamp: Date; roomId: string }) => {
      const { roomId } = data;
      const userName = socket.data.user?.userName;
      const avatar = socket.data.user?.avatar;

      const recieveMessageData: {
        avatar: any;
        sender: string;
        message: string;
        timestamp: Date;
      } = {
        ...data,
        sender: userName,
        avatar,
      };
      socket.to(roomId).emit("message-recieved", recieveMessageData);
    }
  );

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DISCONNECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // By default on page reload the socket wil disconnect, so we need to  handle peer at that time.
  socket.on("disconnect", () => {
    if (currentRoomId) {
      // updating userData from roomData
      let userDatas = roomData[currentRoomId];
      if (userDatas && userDatas.length) {
        userDatas = userDatas.filter((data) => data.socketId != socket.id);
        if (userDatas.length > 0) {
          roomData[currentRoomId] = userDatas;
        } else {
          delete roomData[currentRoomId];
        }
      } else {
        delete roomData[currentRoomId];
      }

      const peers = rooms.get(currentRoomId);
      if (peers) {
        peers.delete(socket.id);
        if (peers.size == 0) rooms.delete(currentRoomId);
        socket.to(currentRoomId).emit("peer-disconnected", socket.id);
      }
    }
  });
};
