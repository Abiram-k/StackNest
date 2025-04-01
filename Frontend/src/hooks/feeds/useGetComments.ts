import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetComments = (feedId: string, showComments: boolean) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const mutation = useQuery({
    queryKey: [`comments-${feedId}`, showComments],
    queryFn: () => feedService.getComments(feedId),
    enabled: showComments == true,
  });
  return { ...mutation };
};
