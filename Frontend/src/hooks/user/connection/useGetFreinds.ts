import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetFreinds = ({ search }: { search: string }) => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const mutate = useQuery({
    queryKey: ["friends", search],
    queryFn: () => connectionService.getAllConnections(search),
  });
  return { ...mutate };
};
