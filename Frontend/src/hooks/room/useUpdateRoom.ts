import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/user/roomService";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { RoomSchema } from "../../../../types/user";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useUpdateRoom = () => {
  const queryClient = new QueryClient();
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({id, data}:{ id: string; data: RoomSchema }) =>
      roomService.updateRoom(id, data),
    onSuccess: (data) => {
      toast.success("Room Updated successfully");
      navigate("/user/room");
      queryClient.invalidateQueries({ queryKey: "rooms" });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "Failed to create room");
    },
  });

  return mutation;
};
