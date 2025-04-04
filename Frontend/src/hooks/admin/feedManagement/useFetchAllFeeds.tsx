import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useFetchAllFeeds = (
  search: string,
  filter: string,
  sort: string,
  page: number,
  limit: number
) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  const mutate = useQuery({
    queryKey: ["allFeeds", search, filter, sort, page, limit],
    queryFn: () => feedService.getAllFeeds(search, filter, sort, page, limit),
  });
  return mutate;
};
