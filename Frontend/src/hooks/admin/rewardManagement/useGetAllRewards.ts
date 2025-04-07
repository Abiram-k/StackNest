import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useQuery } from "@tanstack/react-query";

export const useGetAllRewards = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  return useQuery({
    queryKey: ["rewards"],
    queryFn: () => rewardService.getAllReward(),
  });
};
