import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetLikedFeeds = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutate = useQuery({
    queryKey: ["liked-feeds"],
    queryFn: () => feedService.getLikedFeeds(),
  });
  return mutate;
};
