import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIncrementViewsCount = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (feedId: string) => feedService.incrementViewsCount(feedId),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["feeds"]});
    },
    onError: (error) => {
      toast.error(error.message || "Failed to increment view count");
    },
  });

  return {...mutation};
};
