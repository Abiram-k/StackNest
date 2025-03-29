import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetSelectedFeed = (feedId:string) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutate = useQuery({
    queryKey: ["selected-feed"],
    queryFn: () => feedService.getSelectedFeed(feedId),
  });
  return mutate;
};
