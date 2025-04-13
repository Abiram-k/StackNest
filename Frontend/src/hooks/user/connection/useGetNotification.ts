import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useQuery } from "@tanstack/react-query";

export const useGetNotification = () => {
  const httpService = new HttpService();
  const connectionsService = new ConnectionsService(httpService);
  return useQuery({
    queryKey: ["notifcations"],
    queryFn:()=>connectionsService.getNotifactions()
  });
};
