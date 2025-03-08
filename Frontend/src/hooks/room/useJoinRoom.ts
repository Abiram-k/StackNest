import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/roomService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const httpService = new HttpService();
const roomService = new RoomService(httpService);

export const useJoinRoom = () => {
  const mutation = useMutation({
    mutationFn: (roomId: string) => roomService.joinRoom({ roomId }),
    onSuccess: () => {
      toast.success("Joined successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join Room");
    },
  });

  return { ...mutation };
};

export const useVerifyRoomPassword = (onSuccess?: () => void) => {
  const mutation = useMutation({
    mutationFn: ({ roomId, password }: { roomId: string; password: string }) =>
      roomService.verifyPassword(roomId, password),

    onSuccess: () => {
      if (onSuccess) onSuccess();
      toast.success("Password verified");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify password");
    },
  });

  return { ...mutation };
};
