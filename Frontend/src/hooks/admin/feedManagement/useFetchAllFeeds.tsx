import { HttpService } from "@/api/httpService"
import { FeedService } from "@/api/public/feedService";
import { useQuery } from "@tanstack/react-query"


export const useFetchAllFeeds = () =>{
    const httpService = new HttpService();
    const feedService = new FeedService(httpService);
    const mutate = useQuery({
        queryKey:["allFeeds"],
        queryFn:()=>feedService.getAllFeeds(),
    })
    return mutate;
}