import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetMyFeeds = () => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutate = useQuery({
    queryKey: ["feeds"],
    queryFn: () => feedService.getMyFeeds(),
  });
  return mutate;
};
