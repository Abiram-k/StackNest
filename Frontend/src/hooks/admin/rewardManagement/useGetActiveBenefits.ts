import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useQuery } from "@tanstack/react-query";

export const useGetActiveReward = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  return useQuery({
    queryKey: ["active_reward"],
    queryFn: () => rewardService.getActiveReward(),
  });
};
