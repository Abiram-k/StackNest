import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAcceptRequest = () => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (requestId: string) =>
      connectionService.acceptRequest(requestId),
    onSuccess: () => {
      toast.success("Connection accepted");
      queryClient.invalidateQueries({ queryKey: ["notifcations"] });
    },
    onError: (error) => {
      toast.error(error.message || "failed to accept request");
    },
  });
  return { ...mutation };
}; 
