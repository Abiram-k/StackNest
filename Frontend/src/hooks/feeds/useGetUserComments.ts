import { HttpService } from "@/api/httpService"
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query"


export const useGetUserComments = () => {
    const httpService  = new HttpService();
    const feedService = new FeedService(httpService);
    return useQuery({
        queryKey:["user-comments"],
        queryFn:()=>feedService.getUserComments(),
    })
  
}