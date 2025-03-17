import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import { useQuery } from "@tanstack/react-query";

export const useFetchSelectedRoom = (role: string, id: string) => {
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);

  return useQuery({
    queryKey: ["selectedRoom"],
    queryFn: () => roomService.fetchSelectedRoom(role,id),
  });
};
