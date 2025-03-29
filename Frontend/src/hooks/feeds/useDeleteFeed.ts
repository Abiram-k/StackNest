import { HttpService } from "@/api/httpService";
import { RoomService } from "@/api/public/roomService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FeedService } from "@/api/public/feedService";

export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
//   const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (feedId: string) => feedService.deleteFeed(feedId),
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post Deleted successfully");
    //   navigate("/user/profile/my-feeds");
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
