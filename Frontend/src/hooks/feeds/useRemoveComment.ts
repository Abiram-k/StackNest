import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveComment = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      feedId,
      commentId,
    }: {
      feedId: string;
      commentId: string;
    }) => feedService.deleteComment(feedId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment removed");
    },
    onError: () => {
      toast.error("Failed to remove comment");
    },
  });

  return { ...mutation };
};
