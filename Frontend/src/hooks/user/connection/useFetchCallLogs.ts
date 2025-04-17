import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import {  useQuery } from "@tanstack/react-query";

export const useFetchCallLogs = () => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  return useQuery({
    queryKey: ["call-logs"],
    queryFn: () => connectionService.fetchCallLogs(),
  });
};
