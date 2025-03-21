// import { Server } from "socket.io";
// import http from "http";
// import { config } from "dotenv";

// config();

// export const initSocketIO = (httpServer: http.Server) => {
//   const io = new Server(httpServer, {
//     cors: {
//       origin: process.env.CLIENT_URL,
//       credentials: true,
//     },
//     transports: ["websocket"],
//     connectionStateRecovery: {
//       maxDisconnectionDuration: 2 * 60 * 1000,
//     },
//   });
//   return io;
// };

import { Server } from "socket.io";
import { registerRoomEvents } from "./handler/room.events";
import { socketAuth } from "./middleware/auth";

const initializeSocket = (io: Server) => {
  io.use(socketAuth);   

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
 
    registerRoomEvents(io, socket);
  
    socket.on("disconnect", (reason) => {
      console.log("User Disconnected",reason);
    });
  });
};

export default initializeSocket;
