import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendConnectionRequest = () => {
  const httpService = new HttpService();
  const connectionsService = new ConnectionsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userName: string) =>
      connectionsService.sendConnectionRequest(userName),
    onSuccess: () => {
      toast.success("Request sended");
      queryClient.invalidateQueries({ queryKey: ["sended_request"] });
    },
    onError: () => {
      toast.error("Failed to send request");
    },
  });
  return { ...mutation };
};
