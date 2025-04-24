import { useEffect} from "react";
import { io } from "socket.io-client";
import { tokenManager } from "./tokenManager";
import { toast } from "sonner";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const socket = io(SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = () => {

  useEffect(() => {
    const initSocketConnection = async () => {
      let token = tokenManager.getCurrentToken();
      if (!token) {
        token = await tokenManager.refreshAccessToken();
      }
      socket.auth = { token };
      if (!socket.connected) socket.connect();

      socket.on("connect_error", (error) => {
        toast.error(error.message);
        console.log(error);
        console.log(`Socket Connection Error: ${error.message}`);
      });

      socket.on("error", (error) => {
        toast.error(error.message);
        console.log(`Error: ${error.message}`);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${reason}`);
      });
    };

    initSocketConnection();

    return () => {
      socket.off("connect_error");
      socket.off("error");
      socket.off("connect");
      socket.off("disconnect");
    };
    
  }, [tokenManager.getCurrentToken()]);

  return socket;
};
