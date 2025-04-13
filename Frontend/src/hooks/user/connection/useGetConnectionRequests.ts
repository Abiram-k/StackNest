import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useQuery } from "@tanstack/react-query";

export const useGetConnectionRequests = () => {
  const httpService = new HttpService();
  const connectionsService = new ConnectionsService(httpService);
  return useQuery({
    queryKey: ["sended_request"],
    queryFn: () => connectionsService.getConnectionRequest(),
  });
};
