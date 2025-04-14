import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUnfollow = () => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userName: string) => connectionService.unfollow(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details"] });
    },
    onError: () => {
      toast.error("failed to unfollow ");
    },
  });
  return { ...mutation };
};
