import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetReplies = (
  feedId: string,
  parentCommentId: string,
  isRequested: boolean
) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  return useQuery({
    queryKey: ["replies",isRequested],
    queryFn: () => feedService.getReplies(feedId, parentCommentId),
    enabled: isRequested == true,
  });
  
};
