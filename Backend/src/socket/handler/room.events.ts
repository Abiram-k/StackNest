import { Server, Socket } from "socket.io";
import { RoomService } from "../../services/room.service";
import { RoomRespository } from "../../repositories/room.repository";
import { UserBaseRepository } from "../../repositories/user.repository";
import { Console } from "console";

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
    isHandRised: boolean;
  }[];
}

let roomData: IRoomData = {};

// interface Peer {
//   socketId: string;
//   userId: string;
// }

// const rooms = new Map<string, Peer[]>();

// interface SignalData {
//   to: string;
//   signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
//   from: string;
// }

const rooms = new Map<string, Set<string>>();
export const registerRoomEvents = (io: Server, socket: Socket) => {
  let currentRoomId: string;

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<  JOIN ROOM EVENT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("join-room", (roomId: string) => {
    currentRoomId = roomId;
    console.log("BOFORE JOIN: ", rooms);
    const userId = socket.data.user?.userId;
    const userName = socket.data.user?.userName;
    const avatar = socket.data.user?.avatar;
    socket.join(roomId);
    console.log(roomId);
    const peers = rooms.get(roomId) || new Set<string>();
    // peers.add(userId);
    peers.add(socket.id);
    rooms.set(roomId, peers);
    socket.emit(
      "existing-peers",
      // Array.from(peers).filter((id) => id !== userId)
      Array.from(peers).filter((id) => id !== socket.id)
    );
    // socket.to(roomId).emit("new-peer", userId); 
    socket.to(roomId).emit("new-peer", socket.id);
    console.log(rooms);
  });

  // initialized one
  // socket.on("join-room", (roomId: string) => {

  //   const userId = socket.data.user?.userId;
  //   const userName = socket.data.user?.userName;
  //   const avatar = socket.data.user?.avatar;
  //   if (!userId) {
  //     socket.emit("error", "User is not Authorized");
  //     console.log("User is not Authorized");
  //     return;
  //   }
  //   if (!roomId) {
  //     socket.emit("error", "Room ID is invalid");
  //     return;
  //   }
  //   socket.join(roomId);

  //   if (!roomData[roomId]) {
  //     roomData[roomId] = [
  //       {
  //         userId,
  //         name: userName,
  //         avatar,
  //         isMuted: false,
  //         isVideoOn: false,
  //         isHandRised: false,
  //       },
  //     ];
  //   } else {
  //     if (!roomData[roomId].some((user) => user.userId == userId))
  //       roomData[roomId].push({
  //         userId,
  //         name: userName,
  //         avatar,
  //         isMuted: false,
  //         isVideoOn: false,
  //         isHandRised: false,
  //       });
  //   }
  //   io.to(roomId).emit("participants", roomData[roomId]);
  //   socket.to(roomId).emit("room-message", `${userName} joined room`);
  // });

  // siimple peer
  // socket.on("join-room", (roomId: string) => {

  //   currentRoomId = roomId;
  //   console.log("JOIN REQUEST GOT🌟");
  //   const userId = socket.data.user?.userId;
  //   const userName = socket.data.user?.userName;
  //   const avatar = socket.data.user?.avatar;
  //   if (!userId) {
  //     socket.emit("error", "User is not Authorized");
  //     console.log("User is not Authorized");
  //     return;
  //   }
  //   if (!roomId) {
  //     socket.emit("error", "Room ID is invalid");
  //     return;
  //   }
  //   socket.join(roomId);

  //   if (!roomData[roomId]) {
  //     roomData[roomId] = [
  //       {
  //         userId,
  //         name: userName,
  //         avatar,
  //         isMuted: false,
  //         isVideoOn: false,
  //         isHandRised: false,
  //       },
  //     ];
  //   } else {
  //     if (!roomData[roomId].some((user) => user.userId == userId))
  //       roomData[roomId].push({
  //         userId,
  //         name: userName,
  //         avatar,
  //         isMuted: false,
  //         isVideoOn: false,
  //         isHandRised: false,
  //       });
  //   }
  //   const peers = rooms.get(roomId) || [];
  //   const newPeer = {
  //     socketId: socket.id,
  //     userId,
  //   };

  //   rooms.set(roomId, [...peers, newPeer]);
  //   socket.to(roomId).emit("new-peer", newPeer);
  //   socket.emit("existing-peers", peers);
  //   console.log(rooms);
  //   io.to(roomId).emit("participants", roomData[roomId]);
  //   socket.to(roomId).emit("room-message", `${userName} joined room`);
  // });

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DISCONNECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("disconnect", () => {
    console.log("From Disconnect: ", currentRoomId);
    if (currentRoomId) {
      const peers = rooms.get(currentRoomId);
      console.log(peers, "Socket Id: ", socket.id);
      if (peers) {
        peers.delete(socket.id);
        if (peers.size == 0) rooms.delete(currentRoomId);
        socket.to(currentRoomId).emit("peer-disconnected", socket.id);
      }
    }
  });

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  SIGNALING >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on(
    "signal",
    (data: {
      targetId: string;
      signal: any;
      type: "offer" | "answer" | "candidate";
    }) => {
      console.log("GOT SIGNAL EVENT 🌟", data);

      io.to(data.targetId).emit("signal", {
        senderId: socket.id,
        type: data.type,
        signal: data.signal,
      });

    }
  );

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<  LEAVE ROOM EVENT  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  socket.on("leave-room", (roomId: string) => {
    console.log("LEAVE REQUEST GOT🌟");
    const userName = socket.data.user?.userName;

    roomData[roomId] = roomData[roomId]?.filter(
      (user) => user.name !== userName
    );
    io.to(roomId).emit("participants", roomData[roomId] || []);

    socket.leave(roomId);
    socket.to(roomId).emit("room-message", `${userName} left the room`);
    console.log(`User ${userName} left room: ${roomId}`);
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
      const userData = roomData[roomId].find((user) => user.userId === userId);
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

  // <<<<<<<<<<<<<<<<<<<<<<< DISCONNECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // socket.on("disconnect", (reason) => {
  //   console.log("User Disconnected", reason);
  //   if (!currentRoomId) return;
  //   const peers =
  //     rooms.get(currentRoomId)?.filter((p) => p.socketId !== socket.id) || [];

  //   rooms.set(currentRoomId, peers);
  //   socket.to(currentRoomId).emit("peer-disconnected", socket.id);
  // });
};
