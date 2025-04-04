import { HttpService } from "@/api/httpService"
import { UserProfileService } from "@/api/user/userProfileService";
import { useQuery } from "@tanstack/react-query"


export const useGetStatsLeaderboard = () => {
    const httpService = new HttpService();
  const userProfileService = new UserProfileService(httpService);
    return useQuery({
        queryKey:["stats"],
        queryFn:()=>userProfileService.getStatsLeaderboardData()
    })
}