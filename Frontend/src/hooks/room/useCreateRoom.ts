import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { RoomSchema } from "../../../../types/user";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RoomSchema) => roomService.createRoom(data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Room created successfully");
      navigate("/user/room");
      queryClient.invalidateQueries({ queryKey: "rooms" });
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.message || "Failed to create room");
    },
  });

  return mutation;
};
