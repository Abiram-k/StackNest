import { HttpService } from "@/api/httpService";
import { ConnectionsService } from "@/api/user/connectionsService";
import { useSocket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteMessage = () => {
  const socket = useSocket();
  const httpService = new HttpService();
  const connectionSerive = new ConnectionsService(httpService);
  const mutation = useMutation({
    mutationFn: (messageId: string) =>
      connectionSerive.deleteMessage(messageId),
    onSuccess: (data) => {
      socket.emit("message-deleted", data.deletedMessageId, data.friendId);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete message");
    },
  });
  return { ...mutation };
};
