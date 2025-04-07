import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveReward = () => {
  const httpService = new HttpService();
  const rewardsService = new RewardService(httpService);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (rewardId: string) => rewardsService.removeReward(rewardId),
    onSuccess: () => {
      toast.success("Reward removed");
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
    onError: () => {
      toast.error("Failed to remove Reward");
    },
  });

  return { ...mutation };
};
