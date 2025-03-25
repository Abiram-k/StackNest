import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchRoomSessionHistory = (
  roomId: string,
  role: string,
  {
    search,
    sort,
    filter,
    currentPage,
    limit = 10,
  }: {
    search: string;
    sort: string;
    filter: string;
    currentPage: number;
    limit: number;
  }
) => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const roomService = new RoomService(httpService);

  const mutation = useQuery({
    queryKey: ["roomSession", filter, sort, search, currentPage],
    queryFn: () =>
      roomService.fetchRoomSession(
        roomId,
        role,
        `?search=${search}&sort=${sort}&page=${currentPage}&limit=${limit}`
      ),
  });

  return mutation;
};
