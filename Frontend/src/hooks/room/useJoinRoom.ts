import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import { useSocket } from "@/lib/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const httpService = new HttpService();
const roomService = new RoomService(httpService);

export const useJoinRoom = () => {
  // const socket = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (roomId: string) => roomService.joinRoom({ roomId }),
    onSuccess: (data) => {
      toast.dismiss();
      // socket.emit("join-room", data.roomId);
      // toast.success("Joined successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate(`/user/room/${data.roomId}/conference`);
    },
    onError: (error) => {
      toast.dismiss();
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
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Failed to verify password");
    },
  });

  return { ...mutation };
};
