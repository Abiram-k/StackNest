import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCommentFeed = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      feedId,
      parentId,
      comment,
    }: {
      feedId: string;
      parentId: string | null;
      comment: string;
    }) => feedService.postComment(feedId, parentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
    onError: (error) => {
      toast.error("Failed to post comment");
      console.log(error);
    },
  });

  return { ...mutation };
};
