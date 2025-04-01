// import { HttpService } from "@/api/httpService";
// import { FeedService } from "@/api/public/feedService";
// import { useQuery } from "@tanstack/react-query";

// export const useGetAvailableFeeds = ({
//   filter,
//   sort,
// }: {
//   filter: string;
//   sort: string;
// }) => {
//   const httpService = new HttpService();
//   const feedService = new FeedService(httpService);

//   const mutate = useQuery({
//     queryKey: ["feeds",filter,sort],
//     queryFn: () => feedService.getAvailableFeeds(filter,sort),
//   });
//   return mutate;
// };

import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetAvailableFeeds = ({
  filter,
  sort,
  limit,
}: {
  filter: string;
  sort: string;
  limit: number;
}) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);

  const mutate = useInfiniteQuery({
    queryKey: ["feeds", filter, sort, limit],
    queryFn: ({ pageParam = 1 }) =>
      feedService.getAvailableFeeds(filter, sort, limit, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
  return mutate;
};
