import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { tokenManager } from "./tokenManager";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const socket = io(SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const useSocket = () => {
  const [token, setToken] = useState<string | undefined>(
    tokenManager.getCurrentToken()
  );

  useEffect(() => {
    const token = tokenManager.getCurrentToken();
    toast.success(token || "No token");
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

    return () => {
      socket.off("connect_error");
      socket.off("error");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [tokenManager.getCurrentToken()]);

  return socket;
};
