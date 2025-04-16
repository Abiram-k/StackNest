import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendMessage = () => {
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      friendId,
      content,
    }: {
      friendId: string;
      content: string;
    }) => connectionService.sendMessage(friendId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
  return { ...mutation };
};
