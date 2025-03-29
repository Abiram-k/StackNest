import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { FeedReqType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useUpdateFeed = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ feedId, data }: { feedId: string; data: FeedReqType }) =>
      feedService.updateFeed(feedId,data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post updated successfully");
      navigate("/user/profile/my-feeds");
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss();
      toast.error(error.message || "Failed to update Feed");
    },
  });

  return mutation;
};
