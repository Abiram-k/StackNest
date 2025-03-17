import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBlockRoom = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);

  const mutation = useMutation({
    mutationFn: (roomId: string) => roomService.blockRoom(roomId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Action Done");
      queryClient.invalidateQueries({ queryKey: ["selectedRoom"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Action Undone");
    },
  });

  return mutation;
};
