import { HttpService } from "@/api/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FeedService } from "@/api/public/feedService";

export const useToggleLikeFeed = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutation = useMutation({
    mutationFn: (feedId: string) => feedService.useToggleLikeFeed(feedId),
    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.message || "Failed to upload Feed");
    },
  });

  return mutation;
};
