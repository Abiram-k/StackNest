import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRejectRequest = () => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (requestId: string) =>
      connectionService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifcations"] });
    },
    onError: () => {
      toast.error("failed to reject request");
    },
  });
  return { ...mutation };
};
