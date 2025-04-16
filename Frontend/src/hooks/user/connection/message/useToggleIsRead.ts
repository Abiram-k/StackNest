import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useSocket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleIsRead = (messageId: string, friendId: string) => {
  const socket = useSocket();
  const httpService = new HttpService();
  const connectionService = new ConnectionsService(httpService);
  const mutation = useMutation({
    mutationFn: (messageId: string) =>
      connectionService.toggleIsRead(messageId),
    onSuccess: () => {
      socket.emit("read-message-success", messageId, friendId);
    },
    onError: () => {
      toast.error("Failed to set read boolean");
    },
  });
  return { ...mutation };
};
