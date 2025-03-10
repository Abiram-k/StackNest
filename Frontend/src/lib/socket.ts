import { useEffect } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const socket = io(SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  // auth:(cb) =>{

  // }
  transports: ["websocket"],
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

export const useSocket = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  return socket;
};
