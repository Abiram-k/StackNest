import { HttpService } from "@/api/httpService";
import { RewardService } from "@/api/public/rewardService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClaimReward = () => {
  const httpService = new HttpService();
  const rewardService = new RewardService(httpService);
  const mutation = useMutation({
    mutationFn: (rewardId: string) => rewardService.claimReward(rewardId),
    onSuccess: () => {
      toast.success("Reward claimed");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cliam reward");
    },
  });
  return { ...mutation };
};
