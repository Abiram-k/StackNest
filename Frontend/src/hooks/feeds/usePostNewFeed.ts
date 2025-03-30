import { HttpService } from "@/api/httpService";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FeedReqType } from "@/types";
import { FeedService } from "@/api/public/feedService";
import { toast } from "sonner";

export const usePostNewFeed = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: FeedReqType) => feedService.uploadNewFeed(data),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post uploaded successfully");
      navigate("/user/profile/my-feeds");
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
