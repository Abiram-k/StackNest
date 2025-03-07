import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/roomService";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRemoveRoom = () => {
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);
  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: (id: string) => roomService.removeRoom(id),
    onSuccess: (data) => {
      toast.success("Room was removed");
      queryClient.invalidateQueries({ queryKey: ["myRooms"] });
    },
    onError: (error) => {
      toast.error("Failed to remove room");
      console.log(error);
    },
  });

  return { ...mutate };
};
