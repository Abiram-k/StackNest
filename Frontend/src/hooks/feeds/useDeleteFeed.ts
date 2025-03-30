import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedService } from "@/api/public/feedService";
import { toast } from "sonner";

export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutation = useMutation({
    mutationFn: (feedId: string) => feedService.deleteFeed(feedId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.message || "Failed to Delete Feed");
    },
  });

  return mutation;
};
