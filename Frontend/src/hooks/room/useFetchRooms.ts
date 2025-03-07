import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/roomService";
import { useQuery } from "@tanstack/react-query";

const httpService = new HttpService();
const roomService = new RoomService(httpService);

export const useFetchMyRooms = () => {
  const mutation = useQuery({
    queryKey: ["myRooms"],
    queryFn: () => roomService.fetchMyrooms(),
  });

  return mutation;
};

export const useFetchAllRooms = (role:string,{
  search,
  sort,
  filter,
  currentPage,
}: {
  search: string;
  sort: string;
  filter: string;
  currentPage: number;
}) => {
  const mutation = useQuery({
    queryKey: ["rooms", filter, sort, search, currentPage],
    queryFn: () =>
      roomService.fetchAvailableRooms(
        role,
        `?filter=${filter}&search=${search}&sort=${sort}&page=${currentPage}&limit=10`
      ),
  });

  return mutation;
};
