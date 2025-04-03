import { HttpService } from "@/api/httpService"
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query";


export const useGetSingleFeed = (feedId:string) => {
    const httpService = new HttpService();
    const feedService = new FeedService(httpService);
    return useQuery({
        queryKey:['single-feed'],
        queryFn:()=>feedService.getSingleFeed(feedId)
    })
}