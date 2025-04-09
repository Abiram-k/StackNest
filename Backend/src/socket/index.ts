import { Server } from "socket.io";
import { registerRoomEvents } from "./handler/room.events";
import { socketAuth } from "./middleware/auth";

const initializeSocket = (io: Server) => {
  io.use(socketAuth);   

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);
 
    registerRoomEvents(io, socket);
  
    socket.on("disconnect", (reason) => {
      console.log("User Disconnected",reason);
    });
  });
};

export default initializeSocket;
