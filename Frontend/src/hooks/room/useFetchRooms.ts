import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/user/roomService";
import { useQuery } from "@tanstack/react-query";

const httpService = new HttpService();
const roomService = new RoomService(httpService);

export const useFetchMyRooms = () => {
  const mutation = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomService.fetchMyrooms(),
  });

  return mutation;
};

export const useFetchAllRooms = ({
  search,
  sort,
  filter,
}: {
  search?: string;
  sort?: string;
  filter?: string;
}) => {
  const mutation = useQuery({
    queryKey: ["rooms"],
    queryFn: () =>
      roomService.fetchAvableRooms(
        `?filter=${filter}&search=${search}&sort=${sort}`
      ),
  });

  return mutation;
};
