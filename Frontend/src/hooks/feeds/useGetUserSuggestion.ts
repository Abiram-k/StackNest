import { HttpService } from "@/api/httpService";
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";

export const useGetUserSuggestion = (search: string) => {
  const httpService = new HttpService();
  const feedService = new FeedService(httpService);
  return useQuery({
    queryKey: ["suggested-users",search],
    queryFn: () => feedService.getUserSuggestionFromPrefix(search),
    enabled: search?.trim() !== "",
  
  });
};
