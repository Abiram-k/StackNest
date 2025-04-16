import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useQuery } from "@tanstack/react-query";

export const useGetMessages = (friendId: string) => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  return useQuery({
    queryKey: ["messages", friendId],
    queryFn: () => connectionService.getMessages(friendId),
    enabled: !!friendId.length,
  });
};
