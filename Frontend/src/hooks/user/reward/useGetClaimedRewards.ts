import { HttpService } from "@/api/httpService"
import { RewardService } from "@/api/public/rewardService";
import { useQuery } from "@tanstack/react-query";

export const useGetClaimedRewards = () => {
    const httpService = new HttpService();
    const rewardService = new RewardService(httpService);
    return useQuery({
        queryKey:["claimed_rewards"],
        queryFn:()=>rewardService.getClaimedRewards()
    })
}