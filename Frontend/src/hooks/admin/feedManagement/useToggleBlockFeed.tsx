import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useToggleBlockFeed = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (feedId: string) => feedService.blockOrUnblockFeed(feedId),
    onSuccess: () => {

      toast.dismiss();
      toast.success("Action done");
      queryClient.invalidateQueries({ queryKey: ["allFeeds"] });
    },
    onError: () => {
      toast.dismiss();
      toast.success("Action failed");
    },
  });
  return { ...mutate };
};
