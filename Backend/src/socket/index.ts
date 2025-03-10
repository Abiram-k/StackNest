

import { Server } from "socket.io";
import http from "http";
import { config } from "dotenv";

config();

export const initSocketIO = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
    transports: ["websocket"],
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
    },
  });
  return io;
};




