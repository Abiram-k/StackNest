import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useQuery } from "@tanstack/react-query";

export const useGetSelectedReward = (rewardId: string) => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  return useQuery({
    queryKey: ["reward"],
    queryFn: () => rewardService.getSelectedReward(rewardId),
  });
};
