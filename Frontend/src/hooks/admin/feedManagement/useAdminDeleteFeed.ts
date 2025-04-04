import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAdminDeleteFeed = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({ feedId, reason }: { feedId: string; reason: string }) =>
      feedService.removeFeedByAdmin(feedId, reason),
    onSuccess: () => {
      toast.success("Post successfully removed");
      navigate(-1);
    },
    onError: () => {
      toast.error("Failed to remove post");
    },
  });
  return { ...mutation };
};
